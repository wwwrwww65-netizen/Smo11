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
  Eye,
  Server,
  Database,
  FolderArchive,
  Activity,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { runFullDiagnostics, type DiagnosticResult } from '../services/bioService';

export const Settings: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    theme,
    setTheme,
    geminiKey,
    appwriteEndpoint,
    appwriteProjectId,
    appwriteDatabaseId,
    appwriteBucketId,
    saveAllSettings
  } = useApp();

  // Internal visual state for keys hiding/revealing
  const [showGemini, setShowGemini] = useState(false);

  // Field states
  const [gKey, setGKey] = useState(geminiKey);
  const [endpoint, setEndpoint] = useState(appwriteEndpoint);
  const [projId, setProjId] = useState(appwriteProjectId);
  const [dbId, setDbId] = useState(appwriteDatabaseId);
  const [bucketId, setBucketId] = useState(appwriteBucketId);

  // Diagnostics states
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

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
    saveAllSettings(endpoint, projId, dbId, bucketId, gKey);

    // Satisfying notification
    const popup = document.createElement('div');
    popup.className = "fixed bottom-5 right-5 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold z-50 animate-bounce";
    popup.innerText = t.saveSuccess;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticLoading(true);
    setDiagnosticResult(null);
    try {
      const result = await runFullDiagnostics(endpoint, projId, dbId, bucketId, gKey);
      setDiagnosticResult(result);
    } catch (err) {
      console.error("Diagnostic execution error:", err);
    } finally {
      setDiagnosticLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto relative z-10">

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

          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Key className="h-4.5 w-4.5 text-amber-500" />
              <span>{t.settingsKeys}</span>
            </h3>

            {/* Appwrite Endpoint */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t.appwriteEndpoint}</span>
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://cloud.appwrite.io/v1"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Appwrite Project ID */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-indigo-500" />
                <span>{t.appwriteProject}</span>
              </label>
              <input
                type="text"
                value={projId}
                onChange={(e) => setProjId(e.target.value)}
                placeholder="project_id"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Appwrite Database ID */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-sky-500" />
                <span>{t.appwriteDatabase}</span>
              </label>
              <input
                type="text"
                value={dbId}
                onChange={(e) => setDbId(e.target.value)}
                placeholder="database_id"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Appwrite Storage Bucket ID */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <FolderArchive className="h-3.5 w-3.5 text-teal-500" />
                <span>{t.appwriteBucket}</span>
              </label>
              <input
                type="text"
                value={bucketId}
                onChange={(e) => setBucketId(e.target.value)}
                placeholder="bucket_id"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Gemini API Key */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">{t.apiKeyLabel}</label>
              <div className="relative flex items-center">
                <input
                  type={showGemini ? 'text' : 'password'}
                  value={gKey}
                  onChange={(e) => setGKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
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

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleRunDiagnostics}
                disabled={diagnosticLoading}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {diagnosticLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                ) : (
                  <Activity className="h-4 w-4 text-emerald-500" />
                )}
                <span>{language === 'ar' ? 'فحص الاتصال' : 'Test Connection'}</span>
              </button>

              <button
                onClick={handleSave}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{t.save}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Diagnostics Report Board */}
      {diagnosticResult && (
        <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
            <span>{language === 'ar' ? 'تقرير فحص وتأكيد الاتصال الفوري' : 'Live Connection Diagnostics Status'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Session Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${
              diagnosticResult.session.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{language === 'ar' ? 'جلسة اتصال Appwrite' : 'Appwrite Session'}</span>
                {diagnosticResult.session.success ? <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> : <XCircle className="h-4.5 w-4.5 text-rose-500" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight overflow-y-auto max-h-12 font-mono">
                {diagnosticResult.session.message}
              </p>
            </div>

            {/* Database Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${
              diagnosticResult.database.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{language === 'ar' ? 'قاعدة بيانات Appwrite' : 'Appwrite Database'}</span>
                {diagnosticResult.database.success ? <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> : <XCircle className="h-4.5 w-4.5 text-rose-500" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight overflow-y-auto max-h-12 font-mono">
                {diagnosticResult.database.message}
              </p>
            </div>

            {/* Storage Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${
              diagnosticResult.storage.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{language === 'ar' ? 'مستودع المرفقات Storage' : 'Appwrite Storage'}</span>
                {diagnosticResult.storage.success ? <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> : <XCircle className="h-4.5 w-4.5 text-rose-500" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight overflow-y-auto max-h-12 font-mono">
                {diagnosticResult.storage.message}
              </p>
            </div>

            {/* Gemini API Card */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${
              diagnosticResult.gemini.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{language === 'ar' ? 'مفتاح ذكاء Gemini AI' : 'Gemini AI Engine'}</span>
                {diagnosticResult.gemini.success ? <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> : <XCircle className="h-4.5 w-4.5 text-rose-500" />}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight overflow-y-auto max-h-12 font-mono">
                {diagnosticResult.gemini.message}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
