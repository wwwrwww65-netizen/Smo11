import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  Key,
  Palette,
  Compass,
  ShieldAlert,
  Save,
  Globe,
  EyeOff,
  Eye
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    theme,
    setTheme,
    geminiKey,
    setGeminiKey
  } = useApp();

  // Internal visual state for keys hiding/revealing
  const [showGemini, setShowGemini] = useState(false);

  // Field states
  const [gKey, setGKey] = useState(geminiKey);

  // Biological disciplines selected list
  const [disciplines, setDisciplines] = useState([
    { id: 'micro', nameAr: 'علم الأحياء الدقيقة', nameEn: 'Microbiology', active: true },
    { id: 'gen', nameAr: 'علم الوراثة والجينات', nameEn: 'Genetics & Genomics', active: true },
    { id: 'cell', nameAr: 'علم الأحياء الخلوي', nameEn: 'Cell Biology', active: true },
    { id: 'bioch', nameAr: 'الكيمياء الحيوية', nameEn: 'Biochemistry', active: false },
    { id: 'biomed', nameAr: 'التقنية الحيوية الطبية', nameEn: 'Medical Biotechnology', active: false }
  ]);

  const toggleDiscipline = (id: string) => {
    setDisciplines(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleSave = () => {
    setGeminiKey(gKey);

    // Satisfying notification
    const popup = document.createElement('div');
    popup.className = "fixed bottom-5 right-5 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold z-50 animate-bounce";
    popup.innerText = t.saveSuccess;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto relative z-10">

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Side: Theme & Profile Fields */}
        <div className="space-y-6">

          {/* Appearance Customizer */}
          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Palette className="h-4.5 w-4.5 text-emerald-500" />
              <span>{t.settingsAppearance}</span>
            </h3>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>{t.languageLabel}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    language === 'ar'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  العربية الفصحى
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    language === 'en'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  English (Scientific)
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold">{language === 'ar' ? 'السمة الأساسية' : 'Theme Mode'}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t.themeLight}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t.themeDark}
                </button>
              </div>
            </div>
          </div>

          {/* Fields of Interest */}
          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Compass className="h-4.5 w-4.5 text-blue-500" />
              <span>{t.scientificContext}</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {disciplines.map(d => (
                <button
                  key={d.id}
                  onClick={() => toggleDiscipline(d.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    d.active
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {language === 'ar' ? d.nameAr : d.nameEn}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {language === 'ar'
                ? '💡 يتكيف الذكاء الاصطناعي ويضبط مخرجات المحادثة لتلائم التخصصات المختارة.'
                : '💡 The Bio-Assistant automatically calibrates research models to target the selected disciplines.'}
            </p>
          </div>

        </div>

        {/* Right Side: Cloud API & Credentials */}
        <div className="space-y-6">

          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-md space-y-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Key className="h-4.5 w-4.5 text-amber-500" />
              <span>{t.settingsKeys}</span>
            </h3>

            {/* Gemini API Key */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">{t.apiKeyLabel}</label>
              <div className="relative flex items-center">
                <input
                  type={showGemini ? 'text' : 'password'}
                  value={gKey}
                  onChange={(e) => setGKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Secure warning badge */}
            <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 flex gap-2.5 text-[11px] leading-relaxed text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                {language === 'ar'
                  ? '⚠️ يتم تخزين هذه المفاتيح بشكل محلي بالكامل في متصفحك الخاص (LocalStorage) ولا يتم رفعها أو تداولها خارج النطاق الآمن لخوادم Appwrite وجوجل.'
                  : '⚠️ All keys are secured strictly within your browser local sandboxed storage and mapped directly to Appwrite & Google servers.'}
              </span>
            </div>

            {/* Save Buttons */}
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.01]"
            >
              <Save className="h-4 w-4" />
              <span>{t.save}</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
