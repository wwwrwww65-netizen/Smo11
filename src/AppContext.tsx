import React, { createContext, useContext, useState, useEffect } from 'react';

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
  save: string;
  saveSuccess: string;
  demoModeActive: string;
  demoModeSub: string;
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
    researchCount: "الأبحاث المرفوعة",
    experimentCount: "التجارب النشطة",
    activeSessions: "جلسات التحليل الحالية",
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
    notebookProjects: "مجلدات المشاريع البحثية",
    notebookAnalyze: "تحليل النتائج بالذكاء الاصطناعي",
    settingsAppearance: "تخصيص المظهر وتجربة المستخدم",
    settingsKeys: "تهيئة مفاتيح الربط السحابي والذكاء الاصطناعي",
    themeLight: "الوضع المضيء (النهاري)",
    themeDark: "الوضع الداكن (الليلي)",
    apiKeyLabel: "مفتاح Gemini API Key للذكاء الاصطناعي",
    appwriteEndpoint: "نقطة اتصال Appwrite API Endpoint",
    appwriteProject: "معرّف مشروع Appwrite Project ID",
    save: "حفظ الإعدادات والتفعيل",
    saveSuccess: "تم حفظ الإعدادات بنجاح والاتصال بالخوادم الحقيقية!",
    demoModeActive: "وضع العرض التجريبي المتكامل الذكي نشط حالياً",
    demoModeSub: "يعمل التطبيق بمحاكاة ذكية فائقة الدقة. يمكنك إدخال مفاتيحك الخاصة لتفعيل الربط المباشر بالخوادم.",
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
    newProjectBtn: "مشروع جديد",
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
    researchCount: "Uploaded Research Documents",
    experimentCount: "Active Experiments",
    activeSessions: "Analysis Sessions",
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
    notebookProjects: "Research Project Directories",
    notebookAnalyze: "Analyze Results with AI",
    settingsAppearance: "Appearance & User Experience",
    settingsKeys: "Cloud API & AI Credentials",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    apiKeyLabel: "Gemini API Key",
    appwriteEndpoint: "Appwrite Endpoint",
    appwriteProject: "Appwrite Project ID",
    save: "Save & Activate Credentials",
    saveSuccess: "Credentials saved! Successfully established real-time API tunnels.",
    demoModeActive: "Interactive Mock-Demo Mode Active",
    demoModeSub: "Running high-fidelity simulated bio-logic. Enter your real API keys in Settings to connect to Gemini & Appwrite live.",
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
    newProjectBtn: "New Project",
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
  appwriteEndpoint: string;
  setAppwriteEndpoint: (ep: string) => void;
  appwriteProjectId: string;
  setAppwriteProjectId: (id: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
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
    return localStorage.getItem('gemini_key') || '';
  });

  const [appwriteEndpoint, setAppwriteEndpoint] = useState<string>(() => {
    return localStorage.getItem('appwrite_ep') || '';
  });

  const [appwriteProjectId, setAppwriteProjectId] = useState<string>(() => {
    return localStorage.getItem('appwrite_project_id') || '';
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // True if any key is missing, meaning we run in Interactive Demo Mode
    const hasKeys = !!(localStorage.getItem('gemini_key') && localStorage.getItem('appwrite_project_id'));
    return !hasKeys;
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    // Update document dir and lang for correct RTL/LTR support
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

  const saveKeys = (gKey: string, awEp: string, awProj: string) => {
    setGeminiKey(gKey);
    setAppwriteEndpoint(awEp);
    setAppwriteProjectId(awProj);

    if (gKey) localStorage.setItem('gemini_key', gKey);
    else localStorage.removeItem('gemini_key');

    if (awEp) localStorage.setItem('appwrite_ep', awEp);
    else localStorage.removeItem('appwrite_ep');

    if (awProj) localStorage.setItem('appwrite_project_id', awProj);
    else localStorage.removeItem('appwrite_project_id');

    // Automatically toggle demo mode based on Gemini key presence
    setIsDemoMode(!gKey);
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
      setGeminiKey: (k) => saveKeys(k, appwriteEndpoint, appwriteProjectId),
      appwriteEndpoint,
      setAppwriteEndpoint: (ep) => saveKeys(geminiKey, ep, appwriteProjectId),
      appwriteProjectId,
      setAppwriteProjectId: (id) => saveKeys(geminiKey, appwriteEndpoint, id),
      isDemoMode,
      setIsDemoMode
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
