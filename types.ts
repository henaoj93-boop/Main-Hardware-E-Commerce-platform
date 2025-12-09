

export enum DepartmentType {
  HARDWARE = 'HARDWARE',
  POOL = 'POOL',
  CHRISTMAS = 'CHRISTMAS',
  COMMERCIAL = 'COMMERCIAL'
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Service {
  title: string;
  description: string;
  iconName: string;
}

export interface DepartmentContent {
  id: DepartmentType;
  title: string;
  subtitle: string;
  description: string[];
  fullDescription?: string; // Longer text for the detail page
  iconName: string;
  image: string;
  colorClass: string;
  highlight?: string;
  categories?: Category[];
  services?: Service[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  dept: DepartmentType | 'HOME';
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
  alignment: 'left' | 'center' | 'right';
  height: 'small' | 'medium' | 'large'; // 300px, 400px, 500px
  titleSize: 'normal' | 'large' | 'huge';
  overlayOpacity: number; // 0 to 100
  fontFamily: 'sans' | 'serif' | 'mono';
  buttonSize: 'small' | 'medium' | 'large';
  buttonColor: 'red' | 'blue' | 'green' | 'orange' | 'slate' | 'gradient';
  buttonGradientStart?: string;
  buttonGradientEnd?: string;
  backgroundImagePosition?: 'top' | 'center' | 'bottom';
  backgroundImageScale?: number; // Percentage 100-200
}

export interface GlobalTheme {
  backgroundImage?: string;
  backgroundColor: string;
  accentColor: string;
  glassOpacity: number; // 0 to 100 for the main container
  cursor?: string; // Custom cursor for the landing page
}

export interface DepartmentTheme {
  backgroundImage?: string;
  backgroundColor?: string;
  cursor?: string; // New: Custom cursor for the department page
}

export type DepartmentThemes = Record<string, DepartmentTheme>;

// --- Page Builder Types ---

export type WidgetType = 'HERO' | 'TEXT_BLOCK' | 'IMAGE_FULL' | 'SPLIT_CONTENT' | 'SPACER' | 'VIDEO_EMBED' | 'PRODUCT_SPOTLIGHT' | 'QUICK_ACCESS' | 'FEATURED_PRODUCTS';

export interface WidgetStyle {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '4xl';
  padding?: 'none' | 'small' | 'medium' | 'large';
  height?: 'auto' | 'small' | 'medium' | 'large' | 'screen';
  width?: 'small' | 'medium' | 'large' | 'full'; // 25%, 50%, 75%, 100%
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
  borderRadius?: 'none' | 'medium' | 'large' | 'full';
}

export interface WidgetContent {
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  videoUrl?: string;
  buttonText?: string;
  link?: string;
  // E-commerce Specific
  price?: string;
  salePrice?: string;
  badgeText?: string;
}

export interface PageWidget {
  id: string;
  type: WidgetType;
  content: WidgetContent;
  style: WidgetStyle;
}

export type PageLayouts = Record<string, PageWidget[]>;

export type ViewType = 'HOME' | 'DEPARTMENT' | 'SERVICES' | 'PREORDER' | 'ADMIN';

// --- Integrations & Automation ---

export interface SystemIntegration {
  id: string;
  name: string;
  provider: 'GOOGLE_CALENDAR' | 'QUICKBOOKS' | 'MOTION' | 'SLACK' | 'SHOPIFY';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  iconName: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_REVIEW' | 'FORM_SUBMISSION' | 'DAILY_SUMMARY';
  aiAgentName: string; // e.g., "Inventory Bot"
  aiInstruction: string; // "Check stock levels and email manager if low"
  targetSystem: string; // ID of the system to interact with
  active: boolean;
}