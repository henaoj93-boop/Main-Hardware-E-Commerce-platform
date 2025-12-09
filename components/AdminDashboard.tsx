

import React, { useState, useRef, useEffect } from 'react';
import { DepartmentType, UploadedFile, HeroConfig, PageLayouts, PageWidget, WidgetType, GlobalTheme, DepartmentThemes, SystemIntegration, AutomationRule } from '../types';
import { UploadCloud, Image as ImageIcon, Film, Trash2, CheckCircle, FolderOpen, LogOut, Layout, Edit3, Type, Move, MoveVertical, Sliders, Monitor, RotateCcw, Sparkles, Loader2, Palette, MousePointer2, Plus, GripVertical, X, ArrowUp, ArrowDown, Download, Wallpaper, Check, Maximize2, PaintBucket, ImagePlus, Clipboard, ZoomIn, ArrowUpCircle, ArrowDownCircle, ShoppingBag, Send, Cpu, Play, Save, Settings as SettingsIcon, Link, Zap, Bot, Calendar, FileText, Activity, Pointer, Star } from 'lucide-react';
import Hero from './Hero';
import { generateImage, generateAdminAction, AdminAction } from '../services/geminiService';

interface Props {
  onLogout: () => void;
  files: UploadedFile[];
  onAddFiles: (files: UploadedFile[]) => void;
  onRemoveFile: (id: string) => void;
  heroConfig: HeroConfig;
  onUpdateHeroConfig: (config: HeroConfig) => void;
  pageLayouts: PageLayouts;
  onUpdatePageLayouts: (layouts: PageLayouts) => void;
  globalTheme: GlobalTheme;
  onUpdateGlobalTheme: (theme: GlobalTheme) => void;
  departmentThemes: DepartmentThemes;
  onUpdateDepartmentThemes: (themes: DepartmentThemes) => void;
  integrations: SystemIntegration[];
  onUpdateIntegrations: (integrations: SystemIntegration[]) => void;
  automations: AutomationRule[];
  onUpdateAutomations: (automations: AutomationRule[]) => void;
}

const AdminDashboard: React.FC<Props> = ({ 
  onLogout, files, onAddFiles, onRemoveFile, 
  heroConfig, onUpdateHeroConfig, 
  pageLayouts, onUpdatePageLayouts, 
  globalTheme, onUpdateGlobalTheme,
  departmentThemes, onUpdateDepartmentThemes,
  integrations, onUpdateIntegrations,
  automations, onUpdateAutomations
}) => {
  const [activeTab, setActiveTab] = useState<'MEDIA' | 'HERO' | 'DESIGN' | 'SETTINGS'>('DESIGN');
  const [designMode, setDesignMode] = useState<'LAYOUT' | 'STYLE'>('LAYOUT');
  
  // Consolidate editing context
  const [editingPage, setEditingPage] = useState<string>('HOME');

  // Builder State
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // AI Command Center State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<AdminAction | null>(null);

  // Automation Editing State
  const [editingRule, setEditingRule] = useState<Partial<AutomationRule> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroUploadRef = useRef<HTMLInputElement>(null);
  const themeUploadRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  const pages = [
    { id: 'HOME', label: 'Home / Dashboard', color: 'bg-slate-900' },
    { id: DepartmentType.CHRISTMAS, label: 'Christmasland', color: 'bg-red-600' },
    { id: DepartmentType.HARDWARE, label: 'Hardware', color: 'bg-slate-700' },
    { id: DepartmentType.POOL, label: 'Pool Supply', color: 'bg-blue-500' },
    { id: DepartmentType.COMMERCIAL, label: 'Commercial', color: 'bg-orange-600' },
  ];

  const standardCursors = [
    { value: 'auto', label: 'Default', icon: MousePointer2 },
    { value: 'pointer', label: 'Pointer', icon: Pointer },
    { value: 'crosshair', label: 'Crosshair', icon: Maximize2 },
    { value: 'text', label: 'Text', icon: Type },
    { value: 'wait', label: 'Wait', icon: Loader2 },
  ];

  // --- SAVE FEEDBACK ---
  const handleSaveAnimation = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // --- PASTE HANDLER ---
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only handle paste if in MEDIA tab and not typing in an input
      if (activeTab !== 'MEDIA') return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        handleFiles(Array.from(e.clipboardData.files));
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeTab, editingPage]); 

  // --- MEDIA HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Check if dropping files vs dropping widgets
    if (e.dataTransfer.types.includes('Files')) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    } else {
       // Handle Widget Drop
       const widgetType = e.dataTransfer.getData('widgetType') as WidgetType;
       if (widgetType) {
         addWidget(widgetType);
       }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const processedFiles: UploadedFile[] = [];

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit for Background Themes
        alert(`File ${file.name} is too large (>5MB). Please resize before uploading.`);
        continue;
      }

      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      processedFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image' as 'video' | 'image',
        url: result,
        dept: editingPage as any
      });
    }

    if (processedFiles.length > 0) {
      onAddFiles(processedFiles);
    }
  };

  const handleHeroImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large (>5MB). Please resize before uploading.");
        return;
      }

      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'image',
        url: result,
        dept: editingPage as any
      };
      onAddFiles([newFile]);
      updateHero('backgroundImage', result);
    }
  };

  const handleThemeImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      
      // Update either global or department theme based on target
      if (editingPage === 'HOME') {
        onUpdateGlobalTheme({ ...globalTheme, backgroundImage: result });
      } else {
        onUpdateDepartmentThemes({
          ...departmentThemes,
          [editingPage]: { ...departmentThemes[editingPage], backgroundImage: result }
        });
      }
    }
  };

  const handleCursorFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const file = newFiles[0];
    
    if (file.size > 200 * 1024) {
       if(!confirm("This image is quite large for a cursor. It might not display in some browsers. Continue?")) return;
    }

    const reader = new FileReader();
    const result = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    handleUpdateCursor(`url('${result}'), auto`);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateImage(editingPage);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: `AI-Gen-${editingPage}-${Date.now()}.png`,
        type: 'image',
        url: imageUrl,
        dept: editingPage as any
      };
      onAddFiles([newFile]);
    } catch (error) {
      console.error("Failed to generate image", error);
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const filteredUploads = files.filter(f => f.dept === editingPage);

  // --- HERO EDITOR HANDLERS ---
  const updateHero = (key: keyof HeroConfig, value: any) => {
    onUpdateHeroConfig({ ...heroConfig, [key]: value });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Hero to defaults?')) {
      onUpdateHeroConfig({
        title: "Christmasland is Open",
        subtitle: "Explore the magic on the 2nd floor.",
        buttonText: "Visit Christmasland",
        backgroundImage: "https://picsum.photos/800/400?random=99",
        alignment: 'left',
        height: 'medium',
        titleSize: 'normal',
        overlayOpacity: 40,
        fontFamily: 'serif',
        buttonSize: 'medium',
        buttonColor: 'gradient',
        buttonGradientStart: '#dc2626',
        buttonGradientEnd: '#15803d',
        backgroundImagePosition: 'center',
        backgroundImageScale: 100
      });
    }
  };

  // --- PAGE BUILDER HANDLERS ---
  const currentLayout = pageLayouts[editingPage] || [];

  const addWidget = (type: WidgetType) => {
    const newWidget: PageWidget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: {
        title: 'New Section Title',
        text: 'Click to edit this text content.',
        subtitle: 'Subtitle goes here',
        image: 'https://picsum.photos/600/400',
        videoUrl: ''
      },
      style: {
        padding: 'medium',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        fontFamily: 'sans',
        fontSize: 'base',
        alignment: 'left',
        width: 'full'
      }
    };
    
    const updatedLayout = [...currentLayout, newWidget];
    onUpdatePageLayouts({
      ...pageLayouts,
      [editingPage]: updatedLayout
    });
    setSelectedWidgetId(newWidget.id);
  };

  const removeWidget = (id: string) => {
    const updatedLayout = currentLayout.filter(w => w.id !== id);
    onUpdatePageLayouts({ ...pageLayouts, [editingPage]: updatedLayout });
    setSelectedWidgetId(null);
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === currentLayout.length - 1)) return;
    
    const newLayout = [...currentLayout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLayout[index], newLayout[targetIndex]] = [newLayout[targetIndex], newLayout[index]];
    
    onUpdatePageLayouts({ ...pageLayouts, [editingPage]: newLayout });
  };

  const updateWidget = (id: string, updates: Partial<PageWidget>) => {
    const updatedLayout = currentLayout.map(w => {
      if (w.id === id) {
        return {
          ...w,
          ...updates,
          content: { ...w.content, ...(updates.content || {}) },
          style: { ...w.style, ...(updates.style || {}) }
        };
      }
      return w;
    });
    onUpdatePageLayouts({ ...pageLayouts, [editingPage]: updatedLayout });
  };

  const handleExportLayout = () => {
    const layout = pageLayouts[editingPage] || [];
    const jsonString = JSON.stringify(layout, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout_${editingPage}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- AUTOMATION HANDLERS ---
  const toggleIntegration = (id: string) => {
    const updated = integrations.map(int => 
      int.id === id ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' as any, lastSync: new Date().toLocaleTimeString() } : int
    );
    onUpdateIntegrations(updated);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    if (editingRule.id) {
      // Update existing
      const updated = automations.map(a => a.id === editingRule.id ? { ...a, ...editingRule } as AutomationRule : a);
      onUpdateAutomations(updated);
    } else {
      // Create new
      const newRule: AutomationRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: editingRule.name || 'New Rule',
        trigger: editingRule.trigger || 'NEW_ORDER',
        aiAgentName: editingRule.aiAgentName || 'Agent',
        aiInstruction: editingRule.aiInstruction || '',
        targetSystem: editingRule.targetSystem || '',
        active: true
      };
      onUpdateAutomations([...automations, newRule]);
    }
    setEditingRule(null);
  };

  const deleteRule = (id: string) => {
    onUpdateAutomations(automations.filter(a => a.id !== id));
  };

  // --- AI COMMAND HANDLERS ---
  const handleAiCommand = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setPendingAction(null);
    try {
      const action = await generateAdminAction(aiPrompt, {
        department: editingPage,
        currentHero: heroConfig
      });
      setPendingAction(action);
    } catch (e) {
      alert("Failed to process command. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const executeAction = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'UPDATE_HERO':
        onUpdateHeroConfig({ ...heroConfig, ...pendingAction.data });
        setActiveTab('HERO');
        break;
      case 'CREATE_WIDGET':
        const newWidget: PageWidget = {
          id: Math.random().toString(36).substr(2, 9),
          ...pendingAction.data
        };
        onUpdatePageLayouts({
          ...pageLayouts,
          [editingPage]: [...(pageLayouts[editingPage] || []), newWidget]
        });
        setActiveTab('DESIGN');
        setDesignMode('LAYOUT');
        break;
      case 'UPDATE_THEME':
        onUpdateGlobalTheme({ ...globalTheme, ...pendingAction.data });
        setActiveTab('DESIGN');
        setDesignMode('STYLE');
        break;
    }
    setPendingAction(null);
    setAiPrompt('');
  };

  const selectedWidget = currentLayout.find(w => w.id === selectedWidgetId);

  // Widget Drag Start
  const handleWidgetDragStart = (e: React.DragEvent, type: WidgetType) => {
    e.dataTransfer.setData('widgetType', type);
  };

  // --- PAGE CURSOR HANDLER (Generic) ---
  const handleUpdateCursor = (cursor: string) => {
    if (editingPage === 'HOME') {
      onUpdateGlobalTheme({ ...globalTheme, cursor });
    } else {
      onUpdateDepartmentThemes({
        ...departmentThemes,
        [editingPage]: { ...departmentThemes[editingPage], cursor }
      });
    }
  };

  const currentTheme = editingPage === 'HOME' ? globalTheme : departmentThemes[editingPage];
  const currentBgImage = currentTheme?.backgroundImage;
  const currentBgColor = currentTheme?.backgroundColor || '#e2e8f0';
  const currentCursor = currentTheme?.cursor || 'auto';
  
  // Helper to determine if custom cursor
  const isCustomCursor = currentCursor.startsWith('url');

  return (
    <div className="flex flex-col h-full bg-slate-50/50 relative">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center rounded-t-[40px] lg:rounded-t-none shadow-sm z-20">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-slate-500">Manage store content and settings.</p>
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
              onClick={() => setActiveTab('DESIGN')}
              className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'DESIGN' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Palette size={16} />
              Design & Layout
            </button>
            <button 
              onClick={() => setActiveTab('HERO')}
              className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'HERO' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Edit3 size={16} />
              Home Hero
            </button>
            <button 
              onClick={() => setActiveTab('MEDIA')}
              className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'MEDIA' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FolderOpen size={16} />
              Media
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* ADVANCED SETTINGS BUTTON */}
           <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`p-2 rounded-full transition-colors ${activeTab === 'SETTINGS' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            title="Advanced Settings"
          >
            <SettingsIcon size={20} />
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* SAVE CHANGES BUTTON */}
          <button 
            onClick={handleSaveAnimation}
            className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all shadow-md transform active:scale-95 ${
              saveSuccess 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saveSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
            {saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* === ADVANCED SETTINGS TAB === */}
        {activeTab === 'SETTINGS' && (
          <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
             {/* ... Integrations and Automations code remains same ... */}
             <div className="max-w-6xl mx-auto space-y-8">
                {/* 1. System Integrations */}
                <section>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Link size={20} /></div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-900">System Integrations</h3>
                         <p className="text-sm text-slate-500">Connect third-party apps for data syncing.</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {integrations.map(integration => {
                         const renderIcon = () => {
                            switch(integration.iconName) {
                               case 'calendar': return <Calendar size={24} className="text-blue-500" />;
                               case 'file-text': return <FileText size={24} className="text-green-600" />;
                               case 'check-square': return <Activity size={24} className="text-purple-500" />; // Motion proxy
                               default: return <Link size={24} className="text-slate-400" />;
                            }
                         };
                         const isConnected = integration.status === 'connected';

                         return (
                            <div key={integration.id} className={`bg-white rounded-2xl p-6 border transition-all ${isConnected ? 'border-green-200 shadow-md' : 'border-slate-200 opacity-80'}`}>
                               <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-slate-50 rounded-xl">{renderIcon()}</div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                     <input type="checkbox" checked={isConnected} onChange={() => toggleIntegration(integration.id)} className="sr-only peer" />
                                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                  </label>
                               </div>
                               <h4 className="font-bold text-slate-900 text-lg">{integration.name}</h4>
                               <p className="text-xs font-medium mt-1 mb-4 flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                  <span className={isConnected ? 'text-green-600' : 'text-slate-400'}>{isConnected ? 'Active' : 'Disconnected'}</span>
                               </p>
                            </div>
                         )
                      })}
                   </div>
                </section>
                {/* 2. AI Automation Workflows (Placeholder from previous update) */}
             </div>
          </div>
        )}
        
        {/* === DESIGN TAB (MERGED BUILDER & THEME) === */}
        {activeTab === 'DESIGN' && (
           <div className="flex flex-1 w-full overflow-hidden">
             
             {/* DESIGN SIDEBAR */}
             <div className="w-96 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
                
                {/* 1. Page Selector */}
                <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
                   <label className="text-xs font-bold text-slate-400 uppercase block">Editing Page</label>
                   <div className="relative">
                      <select 
                        value={editingPage}
                        onChange={(e) => setEditingPage(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-900 font-bold rounded-xl py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                         {pages.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                   </div>
                </div>

                {/* 2. Mode Toggle (Layout vs Style) */}
                <div className="p-4 pt-2">
                   <div className="bg-slate-100 p-1 rounded-xl flex font-bold text-xs">
                      <button 
                         onClick={() => setDesignMode('LAYOUT')}
                         className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${designMode === 'LAYOUT' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                         <Layout size={14} /> Layout
                      </button>
                      <button 
                         onClick={() => setDesignMode('STYLE')}
                         className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${designMode === 'STYLE' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                         <PaintBucket size={14} /> Style
                      </button>
                   </div>
                </div>

                {/* 3. SCROLLABLE CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0 space-y-6">
                   
                   {/* === LAYOUT MODE === */}
                   {designMode === 'LAYOUT' && (
                      <div className="animate-fade-in">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">Widgets</h3>
                             <button 
                              onClick={handleExportLayout}
                              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                            >
                              <Download size={12} /> JSON
                            </button>
                         </div>

                         {!selectedWidget ? (
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { type: 'HERO', label: 'Hero', icon: Layout },
                                { type: 'TEXT_BLOCK', label: 'Text Block', icon: Type },
                                { type: 'IMAGE_FULL', label: 'Image', icon: ImageIcon },
                                { type: 'SPLIT_CONTENT', label: 'Split', icon: Sliders },
                                { type: 'PRODUCT_SPOTLIGHT', label: 'Product Spot', icon: ShoppingBag },
                                { type: 'VIDEO_EMBED', label: 'Video', icon: Film },
                                { type: 'QUICK_ACCESS', label: 'Quick Access', icon: Zap },
                                { type: 'FEATURED_PRODUCTS', label: 'Featured', icon: Star },
                                { type: 'SPACER', label: 'Spacer', icon: MoveVertical },
                              ].map((w) => (
                                <div
                                  key={w.type}
                                  draggable
                                  onDragStart={(e) => handleWidgetDragStart(e, w.type as WidgetType)}
                                  className="bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-grab transition-all text-center"
                                >
                                  <w.icon size={24} />
                                  <span className="text-xs font-bold">{w.label}</span>
                                </div>
                              ))}
                              <p className="col-span-2 text-xs text-slate-400 mt-2 text-center">Drag items to the canvas on the right.</p>
                            </div>
                         ) : (
                            // PROPERTY EDITOR
                            <div className="space-y-6">
                              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                                 <h4 className="text-sm font-bold text-blue-800 flex items-center">
                                   <Edit3 size={14} className="mr-2" /> Edit {selectedWidget.type}
                                 </h4>
                                 <button onClick={() => setSelectedWidgetId(null)} className="text-xs text-blue-600 hover:underline">Done</button>
                              </div>
                              
                              {/* Content & Style Fields (Same as before) */}
                              <div className="space-y-3">
                                 {/* Title/Text Inputs if applicable */}
                                 {(['HERO', 'TEXT_BLOCK', 'SPLIT_CONTENT', 'PRODUCT_SPOTLIGHT'].includes(selectedWidget.type)) && (
                                    <>
                                       <label className="text-xs font-bold text-slate-400 uppercase">Content</label>
                                       <input 
                                          type="text" 
                                          placeholder="Title"
                                          value={selectedWidget.content.title || ''}
                                          onChange={(e) => updateWidget(selectedWidget.id, { content: { ...selectedWidget.content, title: e.target.value } })}
                                          className="w-full border p-2 rounded text-sm"
                                       />
                                       <textarea 
                                          placeholder="Text Content"
                                          rows={4}
                                          value={selectedWidget.content.text || ''}
                                          onChange={(e) => updateWidget(selectedWidget.id, { content: { ...selectedWidget.content, text: e.target.value } })}
                                          className="w-full border p-2 rounded text-sm"
                                       />
                                    </>
                                 )}
                                 
                                 {/* Style Section */}
                                 <label className="text-xs font-bold text-slate-400 uppercase mt-4 block">Style</label>
                                 <div>
                                   <label className="block text-xs font-bold text-slate-500 mb-1">Background</label>
                                   <input 
                                     type="color" 
                                     value={selectedWidget.style.backgroundColor || '#ffffff'}
                                     onChange={(e) => updateWidget(selectedWidget.id, { style: { ...selectedWidget.style, backgroundColor: e.target.value } })}
                                     className="w-full h-8 rounded cursor-pointer"
                                   />
                                 </div>
                                 
                                 <button 
                                    onClick={() => removeWidget(selectedWidget.id)}
                                    className="w-full py-2 bg-red-50 text-red-600 text-sm font-bold rounded hover:bg-red-100 flex items-center justify-center gap-2 mt-4"
                                  >
                                    <Trash2 size={14} /> Remove Widget
                                  </button>
                              </div>
                            </div>
                         )}
                      </div>
                   )}

                   {/* === STYLE MODE === */}
                   {designMode === 'STYLE' && (
                      <div className="animate-fade-in space-y-6">
                          <div>
                             <h3 className="font-bold text-slate-900 mb-2">Page Styling</h3>
                             <p className="text-xs text-slate-500">Customizing: <span className="font-bold text-blue-600">{pages.find(p => p.id === editingPage)?.label}</span></p>
                          </div>

                          {/* Wallpaper */}
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Wallpaper</label>
                            <div className="flex gap-2">
                               <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors" onClick={() => themeUploadRef.current?.click()}>
                                  {currentBgImage ? (
                                     <img src={currentBgImage} className="h-20 w-full object-cover rounded" />
                                  ) : (
                                     <div className="py-4 text-slate-400 flex flex-col items-center">
                                       <Wallpaper size={24} className="mb-2" />
                                       <span className="text-xs">Upload</span>
                                     </div>
                                  )}
                               </div>
                               <input type="file" ref={themeUploadRef} className="hidden" accept="image/*" onChange={handleThemeImageSelect} />
                               {currentBgImage && (
                                  <button 
                                     onClick={() => {
                                       if(editingPage === 'HOME') onUpdateGlobalTheme({...globalTheme, backgroundImage: undefined});
                                       else onUpdateDepartmentThemes({...departmentThemes, [editingPage]: {...departmentThemes[editingPage], backgroundImage: undefined}});
                                     }} 
                                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                                  >
                                     <Trash2 size={20} />
                                  </button>
                               )}
                            </div>
                          </div>
                          
                          {/* Color */}
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Base Color</label>
                             <div className="flex flex-wrap gap-2">
                                {['#e2e8f0', '#ffffff', '#f8fafc', '#0f172a', '#fee2e2', '#dbeafe'].map((color) => (
                                   <button
                                      key={color}
                                      onClick={() => {
                                         if(editingPage === 'HOME') onUpdateGlobalTheme({...globalTheme, backgroundColor: color});
                                         else onUpdateDepartmentThemes({...departmentThemes, [editingPage]: {...departmentThemes[editingPage], backgroundColor: color}});
                                      }}
                                      className={`w-8 h-8 rounded-full border border-slate-300 shadow-sm transition-transform hover:scale-110 ${currentBgColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                                      style={{ backgroundColor: color }}
                                   />
                                ))}
                                <input 
                                   type="color" 
                                   value={currentBgColor} 
                                   onChange={(e) => {
                                     if(editingPage === 'HOME') onUpdateGlobalTheme({...globalTheme, backgroundColor: e.target.value});
                                     else onUpdateDepartmentThemes({...departmentThemes, [editingPage]: {...departmentThemes[editingPage], backgroundColor: e.target.value}});
                                   }} 
                                   className="w-8 h-8 rounded-full cursor-pointer border-none p-0 overflow-hidden"
                                />
                             </div>
                          </div>

                          {/* Cursor */}
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Custom Cursor</label>
                            <div 
                              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer relative ${isCustomCursor ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}
                              onClick={() => cursorInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleCursorFiles(Array.from(e.dataTransfer.files));
                              }}
                            >
                               <div className="flex flex-col items-center">
                                  {isCustomCursor ? (
                                     <img src={currentCursor.replace(/^url\(['"](.+)['"]\).*/, '$1')} className="w-8 h-8 object-contain mb-2" />
                                  ) : (
                                     <MousePointer2 size={24} className="text-slate-400 mb-2" />
                                  )}
                                  <span className="text-xs text-slate-500">{isCustomCursor ? 'Change Cursor' : 'Drop Image'}</span>
                               </div>
                               <input type="file" ref={cursorInputRef} className="hidden" accept="image/*" onChange={(e) => { if(e.target.files?.length) handleCursorFiles(Array.from(e.target.files)); }} />
                            </div>
                            {isCustomCursor && (
                               <button onClick={() => handleUpdateCursor('auto')} className="text-xs text-red-500 font-bold mt-2 w-full text-center hover:underline">Reset to Default</button>
                            )}
                          </div>
                      </div>
                   )}
                </div>
             </div>

             {/* PREVIEW CANVAS */}
             <div 
               className="flex-1 bg-slate-200 p-8 overflow-y-auto custom-scrollbar"
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               style={{ 
                  backgroundColor: designMode === 'STYLE' ? currentBgColor : '#e2e8f0',
                  backgroundImage: designMode === 'STYLE' && currentBgImage ? `url(${currentBgImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: currentCursor 
               }}
             >
                {/* Visual indicator for Style Mode */}
                {designMode === 'STYLE' && (
                   <div className="absolute top-4 right-8 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-lg z-50 pointer-events-none border border-slate-200">
                      Viewing Style Preview: {pages.find(p => p.id === editingPage)?.label}
                   </div>
                )}

                <div 
                   className={`min-h-[800px] shadow-2xl mx-auto max-w-5xl rounded-lg relative overflow-hidden transition-all duration-300 ${designMode === 'STYLE' ? 'scale-90 opacity-90 pointer-events-none' : ''}`} 
                   style={{ backgroundColor: isDragging ? '#eff6ff' : 'white' }}
                >
                   {currentLayout.length === 0 ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                        <Layout size={64} className="mb-4" />
                        <p className="text-xl font-bold">Canvas is Empty</p>
                        <p>Drag widgets here to build the {pages.find(p => p.id === editingPage)?.label}.</p>
                     </div>
                   ) : (
                     currentLayout.map((widget, index) => (
                       <div 
                          key={widget.id} 
                          onClick={(e) => { e.stopPropagation(); if(designMode === 'LAYOUT') setSelectedWidgetId(widget.id); }}
                          className={`relative group border-2 transition-all ${selectedWidgetId === widget.id && designMode === 'LAYOUT' ? 'border-blue-500 ring-4 ring-blue-500/20 z-10' : 'border-transparent hover:border-blue-200'}`}
                          style={{
                             padding: widget.style.padding === 'none' ? '0' : widget.style.padding === 'large' ? '4rem' : widget.style.padding === 'small' ? '1rem' : '2rem',
                             backgroundColor: widget.style.backgroundColor,
                             color: widget.style.textColor,
                             textAlign: widget.style.alignment,
                             backgroundImage: widget.style.backgroundImage ? `url(${widget.style.backgroundImage})` : undefined,
                             backgroundSize: 'cover',
                             backgroundPosition: 'center',
                          }}
                       >
                          {/* Render Widget Preview (Simplified Logic) */}
                          {widget.type === 'HERO' && <h1 className="text-4xl font-bold">{widget.content.title}</h1>}
                          {widget.type === 'TEXT_BLOCK' && <p>{widget.content.text}</p>}
                          {widget.type === 'QUICK_ACCESS' && <div className="p-4 bg-slate-100 rounded text-center text-slate-500 font-bold border border-dashed">Quick Access Component</div>}
                          {widget.type === 'FEATURED_PRODUCTS' && <div className="p-4 bg-slate-100 rounded text-center text-slate-500 font-bold border border-dashed">Featured Products Component</div>}
                          {/* ... other previews ... */}
                          
                          {/* Overlay Controls */}
                          {designMode === 'LAYOUT' && (
                             <div className={`absolute top-2 right-2 flex gap-1 ${selectedWidgetId === widget.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity bg-white shadow-sm rounded-lg p-1 z-20`}>
                                <button onClick={(e) => { e.stopPropagation(); moveWidget(index, 'up'); }} className="p-1 hover:bg-slate-100 rounded" disabled={index === 0}><ArrowUp size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); moveWidget(index, 'down'); }} className="p-1 hover:bg-slate-100 rounded" disabled={index === currentLayout.length - 1}><ArrowDown size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }} className="p-1 hover:bg-red-100 text-red-500 rounded"><X size={14} /></button>
                             </div>
                          )}
                       </div>
                     ))
                   )}
                </div>
             </div>
           </div>
        )}

        {/* === MEDIA MANAGER TAB === */}
        {activeTab === 'MEDIA' && (
          <>
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-2">
              <p className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">Select Page</p>
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setEditingPage(p.id)}
                  className={`text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all ${
                    editingPage === p.id 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${p.color} ring-2 ring-white`}></div>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              {/* Enhanced Drop & Paste Zone */}
              <div 
                className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative group ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none rounded-3xl" />
                 
                 <div className="w-24 h-24 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:scale-110 transition-transform relative z-10">
                  {isDragging ? <Download size={48} className="text-blue-500 animate-bounce" /> : <Wallpaper size={40} />}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Drop or Paste Media Here</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto relative z-10">
                  Drag and drop files, or <strong>Paste (Ctrl+V)</strong> images directly from your clipboard.
                </p>

                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                
                <div className="flex justify-center gap-3 relative z-10">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    <FolderOpen size={18} className="mr-2" />
                    Browse Files
                  </button>
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGeneratingImage ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Sparkles size={18} className="mr-2" />}
                    Generate AI Theme
                  </button>
                </div>
              </div>

               <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  Uploaded Assets for {pages.find(p => p.id === editingPage)?.label} <span className="ml-2 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredUploads.length}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredUploads.map((file) => {
                      const isHeroBackground = heroConfig.backgroundImage === file.url;
                      return (
                      <div key={file.id} className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${isHeroBackground ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200'}`}>
                        {isHeroBackground && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center">
                            <Check size={10} className="mr-1" /> Active Hero
                          </div>
                        )}
                        <div className="aspect-square bg-slate-100 relative">
                          {file.type === 'video' ? (
                            <video src={file.url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                          )}
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             {!isHeroBackground && (
                              <button onClick={() => updateHero('backgroundImage', file.url)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" title="Set as Hero Background">
                                <Layout size={16} />
                              </button>
                             )}
                            <button onClick={() => onRemoveFile(file.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )})}
                    {filteredUploads.length === 0 && (
                      <div className="col-span-2 md:col-span-4 py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                        No assets uploaded for this page yet. Drag & Drop or Paste images here.
                      </div>
                    )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* === HERO TAB === */}
        {activeTab === 'HERO' && (
           <div className="flex flex-1 w-full overflow-hidden">
              <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Edit3 size={18} className="mr-2 text-orange-500" /> Hero Config
                  </h3>
                  
                  {/* Content Controls */}
                  <div className="space-y-4">
                     <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">Content</p>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Headline</label>
                          <input type="text" value={heroConfig.title} onChange={(e) => updateHero('title', e.target.value)} className="w-full border p-2 rounded text-sm" />
                      </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Subtitle</label>
                          <textarea rows={3} value={heroConfig.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} className="w-full border p-2 rounded text-sm" />
                      </div>
                  </div>

                  {/* Typography & Layout */}
                   <div className="space-y-4">
                     <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">Typography & Layout</p>
                     
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Title Size</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                          {(['normal', 'large', 'huge'] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateHero('titleSize', s)}
                              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${heroConfig.titleSize === s ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Text Alignment</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              onClick={() => updateHero('alignment', align)}
                              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${heroConfig.alignment === align ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                     </div>
                  </div>

                  {/* Call to Action Button */}
                  <div className="space-y-4">
                     <p className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-2">Call to Action Button</p>
                     <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Button Label</label>
                          <input type="text" value={heroConfig.buttonText} onChange={(e) => updateHero('buttonText', e.target.value)} className="w-full border p-2 rounded text-sm" />
                      </div>
                  </div>
              </div>
              <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-y-auto">
                 <div className="w-full max-w-4xl transform scale-90 shadow-2xl rounded-[32px]"><Hero onNavigate={() => {}} config={heroConfig} /></div>
              </div>
           </div>
        )}

      </div>

      {/* --- AI COMMAND CENTER (Zero Trust UI) --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
         
         {/* Pending Confirmation Card */}
         {pendingAction && (
           <div className="bg-white border-2 border-blue-600 shadow-2xl rounded-2xl p-6 mb-4 w-96 pointer-events-auto animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
                 <Cpu size={20} />
                 <span>Admin AI Proposal</span>
              </div>
              <p className="text-slate-700 text-sm font-medium mb-4">{pendingAction.explanation}</p>
              
              <div className="bg-slate-100 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto text-xs font-mono border border-slate-200">
                 <pre>{JSON.stringify(pendingAction.data, null, 2)}</pre>
              </div>

              <div className="flex gap-2">
                 <button 
                   onClick={executeAction}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                 >
                    <CheckCircle size={16} /> Apply Changes
                 </button>
                 <button 
                   onClick={() => setPendingAction(null)}
                   className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-sm transition-colors"
                 >
                    Discard
                 </button>
              </div>
           </div>
         )}

         {/* Chat Input */}
         <div className="pointer-events-auto bg-white shadow-2xl rounded-full p-2 pr-4 flex items-center gap-2 border border-slate-200 hover:shadow-xl transition-shadow w-full max-w-md">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
               {aiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </div>
            <input 
               type="text" 
               value={aiPrompt}
               onChange={(e) => setAiPrompt(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !aiLoading && handleAiCommand()}
               placeholder="Tell AI to create a sale, banner, or update..."
               className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-400"
               disabled={aiLoading}
            />
            <button 
               onClick={handleAiCommand} 
               disabled={!aiPrompt.trim() || aiLoading}
               className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
            >
               <Send size={18} />
            </button>
         </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
