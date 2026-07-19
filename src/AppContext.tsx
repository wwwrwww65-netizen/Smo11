import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_GEMINI_KEY,
  DEFAULT_APPWRITE_ENDPOINT,
  DEFAULT_APPWRITE_PROJECT_ID,
  DEFAULT_APPWRITE_DATABASE_ID,
  DEFAULT_APPWRITE_STORAGE_BUCKET_ID,
  reinitAppwriteClient
} from './services/bioService';

export type Language = 'ar' | 'en';

export type TranslationKeys = {
  appName: string;
  tagline: string;
  dashboard: string;
  bioChat: string;
  visionLab: string;
  notebook: string;
  settings: string;
  welcome: string;
  welcomeSub: string;
  researchCount: string;
  experimentCount: string;
  activeSessions: string;
  quickAccess: string;
  startChat: string;
  uploadImage: string;
  takeNote: string;
  chatPlaceholder: string;
  send: string;
  suggestedQuestions: string;
  suggestedQ1: string;
  suggestedQ2: string;
  suggestedQ3: string;
  visionDragDrop: string;
  visionOr: string;
  visionBrowse: string;
  visionAnalysis: string;
  notebookProjects: string;
  notebookAnalyze: string;
  settingsAppearance: string;
  settingsKeys: string;
  themeLight: string;
  themeDark: string;
  apiKeyLabel: string;
  appwriteEndpoint: string;
  appwriteProject: string;
  appwriteDatabase: string;
  appwriteBucket: string;
  save: string;
  saveSuccess: string;
  languageLabel: string;
  scientificContext: string;
  bioWorkspace: string;
  cropZoom: string;
  resetCrop: string;
  analyzeSelection: string;
  cellCounter: string;
  microscopeType: string;
  mitosisLabel: string;
  notesTitle: string;
  newNoteBtn: string;
  newProjectBtn: string;
  saveNoteBtn: string;
  placeholderEditor: string;
};

export const translations: Record<Language, TranslationKeys> = {
  ar: {
    appName: "العالمة سمو الأميرة",
    tagline: "المساعد البيولوجي الذكي والمنصة العلمية المتكاملة",
    dashboard: "لوحة القيادة",
    bioChat: "المساعد العلمي (Bio-Chat)",
    visionLab: "معمل التحليل البصري",
    notebook: "دفتر المختبر السحابي",
    settings: "الإعدادات والملف الشخصي",
    welcome: "مرحباً بكم في منصة العالمة سمو الأميرة",
    welcomeSub: "بوابة علمية ذكية مدعومة بالذكاء الاصطناعي لاستكشاف وتحليل البيانات البيولوجية بدقة فائقة.",
    researchCount: "الأبحاث والتقارير",
    experimentCount: "الملاحظات والنتائج",
    activeSessions: "حالة النظام والاتصال",
    quickAccess: "وصول سريع",
    startChat: "بدء محادثة علمية",
    uploadImage: "تحليل صورة مجهرية",
    takeNote: "تدوين ملاحظة بحثية",
    chatPlaceholder: "اسأل المساعد البيولوجي الذكي عن أي تحليل، فحص خلوي، أو تلخيص للبحث...",
    send: "إرسال",
    suggestedQuestions: "أسئلة مقترحة سريعة",
    suggestedQ1: "لخّص هذا البحث البيولوجي واستخرج النتائج الرئيسية",
    suggestedQ2: "ما هي المراحل الأساسية لانقسام الخلايا الميتوزي؟",
    suggestedQ3: "كيف يمكنني رصد البكتيريا سالبة غرام تحت المجهر؟",
    visionDragDrop: "اسحب وأسقط صورة العينة المجهرية هنا",
    visionOr: "أو",
    visionBrowse: "تصفح الملفات من جهازك",
    visionAnalysis: "نتائج التحليل البصري الذكي",
    notebookProjects: "مجلدات المشاريع البحثية (المجموعات)",
    notebookAnalyze: "تحليل النتائج بالذكاء الاصطناعي",
    settingsAppearance: "تخصيص المظهر وتجربة المستخدم",
    settingsKeys: "مفاتيح الذكاء الاصطناعي وربط السحابي",
    themeLight: "الوضع المضيء (النهاري)",
    themeDark: "الوضع الداكن (الليلي)",
    apiKeyLabel: "مفتاح Gemini API Key للذكاء الاصطناعي",
    appwriteEndpoint: "نقطة اتصال Appwrite API Endpoint",
    appwriteProject: "معرّف مشروع Appwrite Project ID",
    appwriteDatabase: "معرّف قاعدة بيانات Appwrite Database ID",
    appwriteBucket: "معرّف حزمة التخزين Appwrite Bucket ID",
    save: "حفظ الإعدادات والتفعيل",
    saveSuccess: "تم حفظ الإعدادات بنجاح وتحديث الاتصال بالخوادم الحقيقية!",
    languageLabel: "لغة المنصة",
    scientificContext: "مجالات الاهتمام والتخصص الدقيق",
    bioWorkspace: "المساحة البيولوجية الذكية",
    cropZoom: "أدوات التقريب وتحديد العينة (Zoom & Crop)",
    resetCrop: "إعادة تعيين التحديد",
    analyzeSelection: "تحليل المنطقة المحددة فقط",
    cellCounter: "عداد الخلايا التقديري",
    microscopeType: "نوع التكبير المجهري",
    mitosisLabel: "مؤشر الانقسام الخلوي",
    notesTitle: "الملاحظات والنتائج البحثية",
    newNoteBtn: "ملاحظة جديدة",
    newProjectBtn: "مجلد/مشروع جديد",
    saveNoteBtn: "حفظ الملاحظة",
    placeholderEditor: "اكتب ملاحظاتك وتجاربك هنا... يدعم تنسيقات Markdown والجداول والمخططات"
  },
  en: {
    appName: "Her Highness Scientist",
    tagline: "Interactive AI Bio-Workspace & Intelligent Scientific Environment",
    dashboard: "Dashboard",
    bioChat: "Bio-Chat Assistant",
    visionLab: "Vision Lab",
    notebook: "Cloud Lab Notebook",
    settings: "Settings & Profile",
    welcome: "Welcome to Her Highness Scientist Platform",
    welcomeSub: "A premium AI-powered workspace engineered for deep exploration and micro-analysis of biological systems.",
    researchCount: "Research & Reports",
    experimentCount: "Notes & Results",
    activeSessions: "System & Cloud Status",
    quickAccess: "Quick Access",
    startChat: "Start Bio-Chat",
    uploadImage: "Analyze Microscope Image",
    takeNote: "Log Research Note",
    chatPlaceholder: "Ask the Bio-Assistant about cell structures, genetic sequencing, or paper summaries...",
    send: "Send",
    suggestedQuestions: "Suggested Quick Queries",
    suggestedQ1: "Summarize this biological research paper and extract key findings",
    suggestedQ2: "What are the primary phases of mitotic cell division?",
    suggestedQ3: "How do I identify Gram-negative bacteria under a compound microscope?",
    visionDragDrop: "Drag & Drop microscopic specimen image here",
    visionOr: "or",
    visionBrowse: "Browse files from your computer",
    visionAnalysis: "Intelligent Vision Analysis",
    notebookProjects: "Research Project Directories (Categories)",
    notebookAnalyze: "Analyze Results with AI",
    settingsAppearance: "Appearance & User Experience",
    settingsKeys: "AI Credentials & Cloud Tunneling",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    apiKeyLabel: "Gemini API Key",
    appwriteEndpoint: "Appwrite Endpoint",
    appwriteProject: "Appwrite Project ID",
    appwriteDatabase: "Appwrite Database ID",
    appwriteBucket: "Appwrite Bucket ID",
    save: "Save & Activate Credentials",
    saveSuccess: "Credentials saved! Successfully established real-time API tunnels.",
    languageLabel: "Platform Language",
    scientificContext: "Scientific Fields of Interest",
    bioWorkspace: "Bio-Workspace AI",
    cropZoom: "Zoom & Crop Control Panel",
    resetCrop: "Reset Selection",
    analyzeSelection: "Analyze Selected Region Only",
    cellCounter: "Est. Cell Count",
    microscopeType: "Microscopic Zoom Scale",
    mitosisLabel: "Mitotic Index Indicator",
    notesTitle: "Scientific Notes & Logs",
    newNoteBtn: "New Note",
    newProjectBtn: "New Folder/Project",
    saveNoteBtn: "Save Note",
    placeholderEditor: "Write research logs, experimental procedures or paste markdown tables..."
  }
};

interface AppContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  t: TranslationKeys;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  appwriteEndpoint: string;
  setAppwriteEndpoint: (val: string) => void;
  appwriteProjectId: string;
  setAppwriteProjectId: (val: string) => void;
  appwriteDatabaseId: string;
  setAppwriteDatabaseId: (val: string) => void;
  appwriteBucketId: string;
  setAppwriteBucketId: (val: string) => void;
  saveAllSettings: (ep: string, proj: string, db: string, bkt: string, gem: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'ar';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_key') || DEFAULT_GEMINI_KEY;
  });

  const [selectedModel, setSelectedModelInternal] = useState<string>(() => {
    return localStorage.getItem('gemini_selected_model') || 'gemini-2.5-flash';
  });

  const [appwriteEndpoint, setAppwriteEndpoint] = useState<string>(() => {
    return localStorage.getItem('appwrite_endpoint') || DEFAULT_APPWRITE_ENDPOINT;
  });

  const [appwriteProjectId, setAppwriteProjectId] = useState<string>(() => {
    return localStorage.getItem('appwrite_project_id') || DEFAULT_APPWRITE_PROJECT_ID;
  });

  const [appwriteDatabaseId, setAppwriteDatabaseId] = useState<string>(() => {
    return localStorage.getItem('appwrite_database_id') || DEFAULT_APPWRITE_DATABASE_ID;
  });

  const [appwriteBucketId, setAppwriteBucketId] = useState<string>(() => {
    return localStorage.getItem('appwrite_storage_bucket_id') || DEFAULT_APPWRITE_STORAGE_BUCKET_ID;
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setTheme = (t: 'light' | 'dark') => setThemeState(t);

  const setSelectedModel = (model: string) => {
    localStorage.setItem('gemini_selected_model', model.trim());
    setSelectedModelInternal(model.trim());
  };

  const saveAllSettings = (ep: string, proj: string, db: string, bkt: string, gem: string) => {
    localStorage.setItem('appwrite_endpoint', ep.trim());
    localStorage.setItem('appwrite_project_id', proj.trim());
    localStorage.setItem('appwrite_database_id', db.trim());
    localStorage.setItem('appwrite_storage_bucket_id', bkt.trim());
    localStorage.setItem('gemini_key', gem.trim());

    setAppwriteEndpoint(ep.trim());
    setAppwriteProjectId(proj.trim());
    setAppwriteDatabaseId(db.trim());
    setAppwriteBucketId(bkt.trim());
    setGeminiKey(gem.trim());

    // Trigger instant API Client reset
    reinitAppwriteClient();
  };

  const t = translations[language];

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      t,
      geminiKey,
      setGeminiKey,
      selectedModel,
      setSelectedModel,
      appwriteEndpoint,
      setAppwriteEndpoint,
      appwriteProjectId,
      setAppwriteProjectId,
      appwriteDatabaseId,
      setAppwriteDatabaseId,
      appwriteBucketId,
      setAppwriteBucketId,
      saveAllSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
