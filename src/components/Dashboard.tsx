import React, { useEffect } from 'react';
import { useApp } from '../AppContext';
import {
  FileText,
  FlaskConical,
  Activity,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  PenTool,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab }) => {
  const { t, language } = useApp();

  // Trigger beautiful confetti when Dashboard mounts
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#3b82f6', '#fbbf24']
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Majestic Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950 rounded-3xl p-8 md:p-12 text-white shadow-xl border border-emerald-500/20">

        {/* Subtle decorative background bioluminescent cells / particles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl animate-pulse-slow" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="h-4 w-4 text-emerald-400" />
            <span>{language === 'ar' ? 'العالمة سمو الأميرة' : 'Her Highness Scientist'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-200 via-teal-100 to-blue-200 bg-clip-text text-transparent">
            {t.welcome}
          </h1>

          <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-2xl">
            {t.welcomeSub}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('bio-chat')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02]"
            >
              <span>{t.startChat}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentTab('vision-lab')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 font-medium text-sm flex items-center gap-2 border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-[1.02]"
            >
              <ImageIcon className="h-4 w-4" />
              <span>{t.uploadImage}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Research Papers Card */}
        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.researchCount}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              14
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Experiments Card */}
        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.experimentCount}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              8
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FlaskConical className="h-6 w-6" />
          </div>
        </div>

        {/* Active Analysis Sessions Card */}
        <div className="bg-white dark:bg-[#111827]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.activeSessions}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>3</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Access Area */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {t.quickAccess}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Quick Chat */}
          <button
            onClick={() => setCurrentTab('bio-chat')}
            className="flex flex-col text-right items-start p-6 rounded-2xl bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 text-left group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              {t.startChat}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
              {language === 'ar'
                ? 'اطرح أسئلة حول الخلايا، الجينات، أو المركبات الكيميائية.'
                : 'Ask questions about cellular biology, genomes, or proteins.'}
            </p>
          </button>

          {/* Quick Upload */}
          <button
            onClick={() => setCurrentTab('vision-lab')}
            className="flex flex-col text-right items-start p-6 rounded-2xl bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 text-left group"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              {t.uploadImage}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
              {language === 'ar'
                ? 'فحص الخلايا، التكبير، التحليل المجهري بمساعدة الذكاء الاصطناعي.'
                : 'Examine specimen tissues, mitosis or bacteria under AI microscopy.'}
            </p>
          </button>

          {/* Quick Note */}
          <button
            onClick={() => setCurrentTab('notebook')}
            className="flex flex-col text-right items-start p-6 rounded-2xl bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 text-left group"
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              {t.takeNote}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
              {language === 'ar'
                ? 'تنظيم التجارب، كتابة الملاحظات واستخلاص النتائج الذكية.'
                : 'Organize lab directories, edit files, and request AI evaluation.'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
