import React, { useState } from 'react';
import { useApp } from '../AppContext';
import {
  Folder,
  Plus,
  Save,
  Sparkles,
  FileText,
  Cpu,
  Trash2,
  FolderOpen,
  Loader2,
  BookOpen
} from 'lucide-react';
import {
  type ProjectFolder,
  type ResearchNote,
  initialProjects,
  initialNotes,
  performBioAiAnalysis
} from '../services/bioService';

export const CloudNotebook: React.FC = () => {
  const { t, language, geminiKey } = useApp();

  // Folders & Notes States
  const [projects, setProjects] = useState<ProjectFolder[]>(initialProjects);
  const [notes, setNotes] = useState<ResearchNote[]>(initialNotes);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [activeNoteId, setActiveNoteId] = useState<string>('note-1');

  // Input states for writing notes
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');

  // AI advice/feedback status
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false);

  // Load selected note content
  const activeNote = notes.find(n => n.id === activeNoteId);

  React.useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteContent(activeNote.content);
      setAiFeedback(''); // Reset advice when changing notes
    }
  }, [activeNoteId, activeNote]); // Fixed dependencies for React Hooks

  const handleSaveNote = () => {
    setNotes(prev => prev.map(n => {
      if (n.id === activeNoteId) {
        return { ...n, title: noteTitle, content: noteContent, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return n;
    }));

    // Add brief satisfying alert/feedback
    const notification = document.createElement('div');
    notification.className = "fixed bottom-5 right-5 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold z-50 animate-bounce";
    notification.innerText = language === 'ar' ? "💾 تم حفظ الملاحظة العلمية!" : "💾 Research note synchronized!";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  const handleCreateNote = () => {
    const newId = `note-${Date.now()}`;
    const newN: ResearchNote = {
      id: newId,
      projectId: activeProjectId,
      title: language === 'ar' ? 'سجل تجريبي غير معنون' : 'Untitled Experiment Log',
      content: language === 'ar'
        ? `### 🔬 دراسة تجريبية جديدة\n**التاريخ**: ${new Date().toISOString().split('T')[0]}\n\nاكتب بروتوكول التجربة والملاحظات والنتائج هنا...`
        : `### 🔬 New Experimental Log\n**Date**: ${new Date().toISOString().split('T')[0]}\n\nInsert laboratory protocols and observed variables here...`,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setNotes(prev => [...prev, newN]);
    setActiveNoteId(newId);
  };

  const handleCreateProject = () => {
    const nameAr = prompt("أدخل اسم المجلد الجديد:") || "";
    const nameEn = prompt("Enter project directory name:") || "";
    if (!nameAr && !nameEn) return;

    const newId = `proj-${Date.now()}`;
    const newP: ProjectFolder = {
      id: newId,
      nameAr: nameAr || nameEn,
      nameEn: nameEn || nameAr,
      created: new Date().toISOString().split('T')[0],
      notesCount: 0
    };

    setProjects(prev => [...prev, newP]);
    setActiveProjectId(newId);
  };

  const handleDeleteNote = (idToDelete: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الملاحظة؟' : 'Delete this research log permanently?')) {
      const remaining = notes.filter(n => n.id !== idToDelete);
      setNotes(remaining);
      if (activeNoteId === idToDelete && remaining.length > 0) {
        setActiveNoteId(remaining[0].id);
      }
    }
  };

  // AI Evaluation service trigger
  const runAiEvaluation = async () => {
    setIsAiEvaluating(true);
    setAiFeedback('');
    try {
      const prompt = language === 'ar'
        ? `قم بتحليل ملاحظات التجربة التالية وتقديم مقترحات لتطوير التجربة، تحديد الأخطاء المنهجية، واقتراح الخطوات العلمية القادمة:\n\n${noteContent}`
        : `Analyze the following wet-lab experiment details. Provide peer-reviewed feedback, look for potential experimental methodology flaws, and propose concrete next step chemical/biological tests:\n\n${noteContent}`;

      const advice = await performBioAiAnalysis(prompt, null, geminiKey);
      setAiFeedback(advice);
    } catch {
      setAiFeedback("AI failed to compile suggestions. Please confirm Gemini configuration.");
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const filteredNotes = notes.filter(n => n.projectId === activeProjectId);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Directories Navigation Column */}
        <div className="lg:col-span-4 space-y-6">

          {/* Projects Folder Board */}
          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FolderOpen className="h-4.5 w-4.5 text-emerald-500" />
                <span>{t.notebookProjects}</span>
              </span>
              <button
                onClick={handleCreateProject}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Create project folder"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {projects.map(proj => {
                const isActive = activeProjectId === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      const matchedNotes = notes.filter(n => n.projectId === proj.id);
                      if (matchedNotes.length > 0) {
                        setActiveNoteId(matchedNotes[0].id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 border border-transparent'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <Folder className={`h-4 w-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{language === 'ar' ? proj.nameAr : proj.nameEn}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                      {notes.filter(n => n.projectId === proj.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project-specific Notes list */}
          <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-blue-500" />
                <span>{t.notesTitle}</span>
              </span>
              <button
                onClick={handleCreateNote}
                className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.newNoteBtn}</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  {language === 'ar' ? 'لا توجد ملاحظات في هذا المجلد.' : 'No active notes logged in this directory.'}
                </div>
              ) : (
                filteredNotes.map(n => {
                  const isActive = activeNoteId === n.id;
                  return (
                    <div
                      key={n.id}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20'
                      }`}
                    >
                      <button
                        onClick={() => setActiveNoteId(n.id)}
                        className="flex-1 text-left font-semibold text-xs truncate mr-2"
                      >
                        {n.title}
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Rich Text Editor and AI Advice Area */}
        <div className="lg:col-span-8 space-y-6">

          {filteredNotes.length > 0 ? (
            <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl flex flex-col min-h-[500px]">

              {/* Editor Top Toolbar */}
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="bg-transparent border-none text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0 flex-1"
                  placeholder="Experiment Title..."
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={runAiEvaluation}
                    disabled={isAiEvaluating}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                  >
                    {isAiEvaluating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    <span>{t.notebookAnalyze}</span>
                  </button>

                  <button
                    onClick={handleSaveNote}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    title={t.saveNoteBtn}
                  >
                    <Save className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Rich Markdown Text Area */}
              <div className="flex-1 p-6 flex flex-col">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={t.placeholderEditor}
                  className="w-full flex-1 min-h-[300px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-mono"
                />
              </div>

              {/* Dynamic AI Diagnostic Panel below editor */}
              {aiFeedback && (
                <div className="p-6 bg-emerald-500/[0.02] border-t border-emerald-500/10 animate-fade-in space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4.5 w-4.5 text-emerald-500" />
                    <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                      {language === 'ar' ? 'ملاحظات التقويم الذكي من المساعد البيولوجي' : 'AI Laboratory Diagnostic Insight'}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {aiFeedback}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-[#111827]/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 shadow-xl flex flex-col items-center justify-center min-h-[500px]">
              <BookOpen className="h-12 w-12 text-slate-300 mb-4 animate-float" />
              <p className="font-semibold text-sm mb-2">{language === 'ar' ? 'حدد أو أنشئ ملاحظة للبدء' : 'Select or Create an Experiment Log'}</p>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>{t.newNoteBtn}</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
