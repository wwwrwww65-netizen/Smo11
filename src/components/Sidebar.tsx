import React from 'react';
import { useApp } from '../AppContext';
import { CustomLogo } from './CustomLogo';
import {
  LayoutDashboard,
  MessageSquare,
  Eye,
  BookOpen,
  Settings as SettingsIcon,
  Languages,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage, theme, setTheme, t } = useApp();

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'bio-chat', label: t.bioChat, icon: MessageSquare },
    { id: 'vision-lab', label: t.visionLab, icon: Eye },
    { id: 'notebook', label: t.notebook, icon: BookOpen },
    { id: 'settings', label: t.settings, icon: SettingsIcon },
  ];

  return (
    <aside className="w-80 flex-shrink-0 bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between h-screen sticky top-0 transition-all duration-300">
      <div className="flex flex-col gap-8">

        {/* Brand Crest / Logo Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <CustomLogo className="h-12 w-12" />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans leading-tight">
              {language === 'ar' ? 'العالمة سمو الأميرة' : 'HH Scientist'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium tracking-widest uppercase">
              {t.bioWorkspace}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings, Language Switcher, Theme and Demo banner */}
      <div className="flex flex-col gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">

        {/* Quick toggles */}
        <div className="flex items-center justify-between gap-2">

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            title="Switch Language / تغيير اللغة"
          >
            <Languages className="h-4 w-4" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Toggle theme / تغيير المظهر"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-400 dark:text-slate-600">
          © 2025 HH Princess Scientist Platform
        </div>
      </div>
    </aside>
  );
};
