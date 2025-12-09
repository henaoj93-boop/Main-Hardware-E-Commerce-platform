

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Departments from './components/Departments';
import QuickAccess from './components/QuickAccess';
import FeaturedProducts from './components/FeaturedProducts';
import DepartmentDetail from './components/DepartmentDetail';
import DynamicPage from './components/DynamicPage';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import PreOrder from './components/PreOrder';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { DepartmentType, UploadedFile, HeroConfig, PageLayouts, GlobalTheme, DepartmentThemes, SystemIntegration, AutomationRule } from './types';
import { departments } from './data';
import { getFiles, saveFile, deleteFile, getSetting, saveSetting } from './services/db';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'DEPARTMENT' | 'SERVICES' | 'PREORDER' | 'ADMIN'>('HOME');
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Admin Files State
  const [adminFiles, setAdminFiles] = useState<UploadedFile[]>([]);

  // Page Layouts State
  const [pageLayouts, setPageLayouts] = useState<PageLayouts>({});

  // Global Theme State
  const defaultTheme: GlobalTheme = {
    backgroundColor: '#e2e8f0',
    accentColor: '#f97316', // Orange-500
    glassOpacity: 40,
    backgroundImage: undefined,
    cursor: 'auto'
  };

  const [globalTheme, setGlobalTheme] = useState<GlobalTheme>(defaultTheme);

  // Department Themes State
  const [departmentThemes, setDepartmentThemes] = useState<DepartmentThemes>({
    [DepartmentType.HARDWARE]: {},
    [DepartmentType.CHRISTMAS]: {},
    [DepartmentType.POOL]: {},
    [DepartmentType.COMMERCIAL]: {},
    'HOME': {}
  });
  
  const defaultHeroConfig: HeroConfig = {
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
  };

  const [heroConfig, setHeroConfigState] = useState<HeroConfig>(defaultHeroConfig);

  // --- Integrations & Automation State ---
  const [integrations, setIntegrations] = useState<SystemIntegration[]>([
    { id: '1', name: 'Google Calendar', provider: 'GOOGLE_CALENDAR', status: 'disconnected', iconName: 'calendar' },
    { id: '2', name: 'QuickBooks Online', provider: 'QUICKBOOKS', status: 'disconnected', iconName: 'file-text' },
    { id: '3', name: 'Motion', provider: 'MOTION', status: 'disconnected', iconName: 'check-square' },
    { id: '4', name: 'Slack', provider: 'SLACK', status: 'disconnected', iconName: 'message-square' },
  ]);

  const [automations, setAutomations] = useState<AutomationRule[]>([
    { 
      id: 'a1', 
      name: 'Order Confirmation', 
      trigger: 'NEW_ORDER', 
      aiAgentName: 'Sales Assistant', 
      aiInstruction: 'Draft a personalized thank you email mentioning the specific items ordered and suggesting related accessories.', 
      targetSystem: '1', 
      active: true 
    }
  ]);

  // Load Data from IndexedDB on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Files
        const files = await getFiles();
        if (files && files.length > 0) {
          setAdminFiles(files);
        }

        // Load Settings
        const savedTheme = await getSetting('globalTheme');
        if (savedTheme) setGlobalTheme(savedTheme);

        const savedDeptThemes = await getSetting('departmentThemes');
        if (savedDeptThemes) setDepartmentThemes(savedDeptThemes);

        const savedHero = await getSetting('heroConfig');
        if (savedHero) setHeroConfigState(prev => ({ ...prev, ...savedHero }));

        const savedLayouts = await getSetting('pageLayouts');
        if (savedLayouts) setPageLayouts(savedLayouts);

        const savedIntegrations = await getSetting('integrations');
        if (savedIntegrations) setIntegrations(savedIntegrations);

        const savedAutomations = await getSetting('automations');
        if (savedAutomations) setAutomations(savedAutomations);

      } catch (error) {
        console.error("Failed to load data from DB:", error);
      }
    };
    loadData();
  }, []);

  const handleUpdateGlobalTheme = async (newTheme: GlobalTheme) => {
    setGlobalTheme(newTheme);
    await saveSetting('globalTheme', newTheme);
  };

  const handleUpdateDepartmentThemes = async (newThemes: DepartmentThemes) => {
    setDepartmentThemes(newThemes);
    await saveSetting('departmentThemes', newThemes);
  };

  const handleUpdateHeroConfig = async (newConfig: HeroConfig) => {
    setHeroConfigState(newConfig);
    await saveSetting('heroConfig', newConfig);
  };

  const handleUpdatePageLayouts = async (newLayouts: PageLayouts) => {
    setPageLayouts(newLayouts);
    await saveSetting('pageLayouts', newLayouts);
  };

  const handleUpdateIntegrations = async (newIntegrations: SystemIntegration[]) => {
    setIntegrations(newIntegrations);
    await saveSetting('integrations', newIntegrations);
  };

  const handleUpdateAutomations = async (newAutomations: AutomationRule[]) => {
    setAutomations(newAutomations);
    await saveSetting('automations', newAutomations);
  };

  const handleNavigate = (view: any) => {
    if (Object.values(DepartmentType).includes(view)) {
      setSelectedDeptId(view as DepartmentType);
      setCurrentView('DEPARTMENT');
    } else {
      setCurrentView(view);
      if (view === 'HOME') setSelectedDeptId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (password: string) => {
    // Simple password check for demonstration
    if (password === 'main123') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    handleNavigate('HOME');
  };

  const handleAddAdminFiles = async (newFiles: UploadedFile[]) => {
    // Optimistically update state
    setAdminFiles(prev => [...prev, ...newFiles]);
    
    // Save to IndexedDB
    try {
      for (const file of newFiles) {
        await saveFile(file);
      }
    } catch (e) {
      console.error("Failed to save file to DB", e);
      alert("Error saving file. Your browser storage might be full.");
    }
  };

  const handleRemoveAdminFile = async (id: string) => {
    setAdminFiles(prev => prev.filter(f => f.id !== id));
    await deleteFile(id);
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId);

  // Determine active background and cursor based on view
  const getActiveThemeKey = () => {
    if (currentView === 'DEPARTMENT' && selectedDeptId) return selectedDeptId;
    if (currentView === 'HOME') return 'HOME';
    return null;
  };
  
  const activeKey = getActiveThemeKey();
  
  const activeBgImage = (activeKey && departmentThemes[activeKey]?.backgroundImage) 
    ? departmentThemes[activeKey].backgroundImage 
    : globalTheme.backgroundImage;

  const activeBgColor = (activeKey && departmentThemes[activeKey]?.backgroundColor)
    ? departmentThemes[activeKey].backgroundColor
    : globalTheme.backgroundColor;

  // Cursor Priority: Page specific -> Global (Home) -> Default 'auto'
  const activeCursor = (activeKey && departmentThemes[activeKey]?.cursor)
    ? departmentThemes[activeKey].cursor
    : (currentView === 'HOME' && globalTheme.cursor) 
      ? globalTheme.cursor 
      : 'auto';

  // Check if HOME has a custom layout
  const homeLayout = pageLayouts['HOME'];

  return (
    <div 
      className="min-h-screen lg:p-8 flex gap-8 transition-all duration-500 bg-fixed"
      style={{
        backgroundColor: activeBgColor,
        backgroundImage: activeBgImage ? `url(${activeBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        cursor: activeCursor
      }}
    >
      {/* Sidebar - Desktop & Mobile Drawer */}
      <Sidebar 
        activeView={currentView === 'DEPARTMENT' ? selectedDeptId || 'DEPARTMENTS' : currentView} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Main Content Area - The "Glass Dashboard" */}
      <main className="flex-1 pt-20 lg:pt-0 min-w-0">
        <div 
          className="backdrop-blur-xl border border-white/50 shadow-2xl rounded-[40px] p-6 lg:p-10 min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-10 overflow-hidden relative transition-all duration-300"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${globalTheme.glassOpacity / 100})`
          }}
        >
          
          {/* Chrome/Metallic Background Effect within the card (Dynamic opacity) */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {currentView === 'HOME' ? (
             homeLayout && homeLayout.length > 0 ? (
               <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
                 <DynamicPage layout={homeLayout} onNavigate={handleNavigate} />
                 {/* Footer always at bottom of custom home */}
                 <div className="mt-12">
                   <Footer onNavigate={handleNavigate} />
                 </div>
               </div>
             ) : (
                <>
                  {/* Left/Center Column (Main Dashboard Feed) */}
                  <div className="flex-1 flex flex-col gap-8 min-w-0 relative z-10">
                    
                    {/* Header Text */}
                    <div className="flex justify-between items-end px-2">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-800 serif">Welcome, Neighbor</h1>
                        <p className="text-slate-500 font-medium">Here's what's happening at Main Hardware today.</p>
                      </div>
                    </div>

                    {/* Hero / Welcome Card - Now uses Config State */}
                    <Hero onNavigate={handleNavigate} config={heroConfig} />

                    {/* Quick Access Circles */}
                    <QuickAccess />

                    {/* Bottom Section - Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <FeaturedProducts />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="font-bold text-slate-700 text-lg">Community Feed</span>
                        </div>
                        <div className="glass-card p-6 rounded-2xl h-full min-h-[200px] flex flex-col justify-center items-center text-center">
                            <p className="text-slate-500 italic mb-4">"The best place for pool supplies in Wilkes-Barre!"</p>
                            <div className="flex -space-x-2 mb-2">
                              {[1,2,3].map(i => (
                                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://picsum.photos/50/50?random=${i}`} alt="User" />
                              ))}
                              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">+42</div>
                            </div>
                            <button className="text-sm font-bold text-orange-600 mt-2 hover:underline">Read Reviews</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:hidden">
                      <Footer onNavigate={handleNavigate} />
                    </div>
                  </div>

                  {/* Right Panel (Desktop Only usually, but we stack on mobile) */}
                  <div className="lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200/50 pt-8 lg:pt-0 lg:pl-10 relative z-10">
                    <Departments onNavigate={handleNavigate} />
                  </div>
                </>
             )
          ) : currentView === 'DEPARTMENT' && selectedDept ? (
            <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
              <DepartmentDetail 
                department={selectedDept} 
                onBack={() => handleNavigate('HOME')}
                customMedia={adminFiles.filter(f => f.dept === selectedDept.id)}
                layout={pageLayouts[selectedDept.id] || null}
              />
            </div>
          ) : currentView === 'PREORDER' ? (
             <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
               <button onClick={() => handleNavigate('HOME')} className="mb-4 text-slate-500 hover:text-orange-500 font-bold text-sm flex items-center gap-2">← Back to Dashboard</button>
               <PreOrder />
             </div>
          ) : currentView === 'ADMIN' ? (
            <div className="w-full h-full relative z-10">
              {isAdminAuthenticated ? (
                <AdminDashboard 
                  onLogout={handleAdminLogout} 
                  files={adminFiles}
                  onAddFiles={handleAddAdminFiles}
                  onRemoveFile={handleRemoveAdminFile}
                  heroConfig={heroConfig}
                  onUpdateHeroConfig={handleUpdateHeroConfig}
                  pageLayouts={pageLayouts}
                  onUpdatePageLayouts={handleUpdatePageLayouts}
                  globalTheme={globalTheme}
                  onUpdateGlobalTheme={handleUpdateGlobalTheme}
                  departmentThemes={departmentThemes}
                  onUpdateDepartmentThemes={handleUpdateDepartmentThemes}
                  integrations={integrations}
                  onUpdateIntegrations={handleUpdateIntegrations}
                  automations={automations}
                  onUpdateAutomations={handleUpdateAutomations}
                />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center text-slate-400 font-bold text-lg">
              Coming Soon...
              <button onClick={() => handleNavigate('HOME')} className="ml-4 text-orange-500 underline">Go Home</button>
            </div>
          )}

        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default App;
