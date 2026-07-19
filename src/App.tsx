import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BioChat } from './components/BioChat';
import { VisionLab } from './components/VisionLab';
import { CloudNotebook } from './components/CloudNotebook';
import { Settings } from './components/Settings';

import {
  Dna,
  Award
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { language, t } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Render correct page based on chosen sidebar tab
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'bio-chat':
        return <BioChat />;
      case 'vision-lab':
        return <VisionLab />;
      case 'notebook':
        return <CloudNotebook />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b15] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

      {/* Dynamic Interactive Bioluminescence Micro-background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[30%] w-72 h-72 rounded-full bg-emerald-500/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[30%] right-[10%] w-96 h-96 rounded-full bg-blue-500/5 blur-[150px] animate-pulse-slow" />

        {/* Subtle decorative grid cells */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 relative z-10">

        {/* Sidebar Panel */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Dynamic content view */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">

          {/* Top Majestic Royal Brand Bar */}
          <header className="flex items-center justify-between pb-8 mb-8 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-emerald-500" />
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                  {t.bioWorkspace}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.tagline}
              </p>
            </div>

            {/* Noble Crown Icon / Badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {language === 'ar' ? 'منصة العالمة سمو الأميرة' : 'Princess Scientist Platform'}
                </span>
                <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-widest">
                  {language === 'ar' ? 'الرعاية الملكية' : 'Royal Patronage'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </header>

          {/* Active view renderer */}
          <div className="relative">
            {renderActiveTab()}
          </div>

        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
