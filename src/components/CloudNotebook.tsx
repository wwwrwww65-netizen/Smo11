import React, { useState, useEffect, useCallback } from 'react';
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
  getLabNotes,
  createLabNote,
  updateLabNote,
  deleteLabNote,
  performBioAiAnalysis
} from '../services/bioService';

export const CloudNotebook: React.FC = () => {
  const { t, language, geminiKey, selectedModel } = useApp();

  // Folders & Notes States
  const [projects, setProjects] = useState<ProjectFolder[]>([]);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('General');
  const [activeNoteId, setActiveNoteId] = useState<string>('');

  // Input states for writing notes
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');

  // Loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // AI advice/feedback status
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false);

  // Load all notes on mount
  const loadNotesFromAppwrite = useCallback(async () => {
    setIsLoading(true);
    try {
      const records = await getLabNotes();
      setNotes(records);

      // Extract unique categories as directories/projects
      const categories = Array.from(new Set(records.map(r => r.projectId)));
      const derivedProjects: ProjectFolder[] = categories.map((cat) => ({
        id: cat,
        nameAr: cat,
        nameEn: cat,
        created: new Date().toISOString().split('T')[0],
        notesCount: records.filter(r => r.projectId === cat).length
      }));

      // Ensure at least "General" or "عام" exists
      if (!derivedProjects.some(p => p.id === 'General')) {
        derivedProjects.unshift({
          id: 'General',
          nameAr: 'ملاحظات عامة',
          nameEn: 'General Notes',
          created: new Date().toISOString().split('T')[0],
          notesCount: 0
        });
      }

      setProjects(derivedProjects);

      // Set active notes
      const matched = records.filter(r => r.projectId === activeProjectId);
      if (matched.length > 0) {
        setActiveNoteId(matched[0].id);
      } else {
        setActiveNoteId('');
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeProjectId]);

  useEffect(() => {
    loadNotesFromAppwrite();
  }, [loadNotesFromAppwrite]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteContent(activeNote.content);
      setAiFeedback(''); // Reset advice when changing notes
    } else {
      setNoteTitle('');
      setNoteContent('');
      setAiFeedback('');
    }
  }, [activeNoteId, activeNote]);

  const handleSaveNote = async () => {
    if (!activeNoteId) return;
    setIsLoading(true);
    try {
      await updateLabNote(activeNoteId, noteTitle, noteContent, activeProjectId);
      
      setNotes(prev => prev.map(n => {
        if (n.id === activeNoteId) {
          return { ...n, title: noteTitle, content: noteContent, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return n;
      }));

      // brief satisfying notification
      const notification = document.createElement('div');
      notification.className = "fixed bottom-5 right-5 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold z-50 animate-bounce";
      notification.innerText = language === 'ar' ? "💾 تم مزامنة وحفظ الملاحظة سحابياً!" : "💾 Note synced and saved in Appwrite!";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2500);
    } catch (err) {
      console.error("Save note error:", err);
      alert(language === 'ar' ? 'حدث خطأ أثناء حفظ الملاحظة سحابياً' : 'Could not save note to Appwrite databases.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    setIsLoading(true);
    try {
      const defaultTitle = language === 'ar' ? 'سجل تجريبي جديد' : 'New Experiment Log';
      const defaultContent = language === 'ar'
        ? `### 🔬 سجل دراسة بيولوجية\n**التاريخ**: ${new Date().toISOString().split('T')[0]}\n\nاكتب تفاصيل تجربتك البيولوجية هنا...`
        : `### 🔬 Research Log Details\n**Date**: ${new Date().toISOString().split('T')[0]}\n\nExplain wet-lab variables, samples, and results here...`;

      const newN = await createLabNote(defaultTitle, defaultContent, activeProjectId);
      setNotes(prev => [...prev, newN]);
      setActiveNoteId(newN.id);
    } catch (err) {
      console.error("Create note error:", err);
      alert(language === 'ar' ? 'فشل إنشاء ملاحظة جديدة' : 'Failed to create new cloud note.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    const projName = prompt(language === 'ar' ? 'أدخل اسم المجلد أو التصنيف الجديد:' : 'Enter new directory/category name:') || "";
    if (!projName.trim()) return;

    const exists = projects.some(p => p.id.toLowerCase() === projName.toLowerCase());
    if (exists) return;

    const newP: ProjectFolder = {
      id: projName,
      nameAr: projName,
      nameEn: projName,
      created: new Date().toISOString().split('T')[0],
      notesCount: 0
    };

    setProjects(prev => [...prev, newP]);
    setActiveProjectId(projName);
    setActiveNoteId('');
  };

  const handleDeleteNote = async (idToDelete: string) => {
    if (confirm(language === 'ar' ? 'هل أنتِ متأكدة من حذف هذه الملاحظة سحابياً؟' : 'Are you sure you want to delete this research log from Appwrite databases permanently?')) {
      setIsLoading(true);
      try {
        await deleteLabNote(idToDelete);
        const remaining = notes.filter(n => n.id !== idToDelete);
        setNotes(remaining);
        if (activeNoteId === idToDelete) {
          const matched = remaining.filter(r => r.projectId === activeProjectId);
          if (matched.length > 0) {
            setActiveNoteId(matched[0].id);
          } else {
            setActiveNoteId('');
          }
        }
      } catch (err) {
        console.error("Delete note error:", err);
        alert(language === 'ar' ? 'فشل حذف الملاحظة' : 'Could not delete the note.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // AI Evaluation service trigger
  const runAiEvaluation = async () => {
    if (!noteContent.trim()) return;
    setIsAiEvaluating(true);
    setAiFeedback('');
    try {
      const prompt = language === 'ar'
        ? `قم بتحليل ملاحظات التجربة التالية وتقديم مقترحات لتطوير التجربة، تحديد الأخطاء المنهجية، واقترح الخطوات العلمية القادمة:\n\n${noteContent}`
        : `Analyze the following wet-lab experiment details. Provide peer-reviewed feedback, look for potential experimental methodology flaws, and propose concrete next step chemical/biological tests:\n\n${noteContent}`;

      // Feed selected model to evaluate
      const advice = await performBioAiAnalysis(prompt, null, geminiKey, selectedModel);
      setAiFeedback(advice);
    } catch {
      setAiFeedback("AI failed to compile suggestions. Please confirm Gemini configuration.");
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const filteredNotes = notes.filter(n => n.projectId === activeProjectId);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto relative z-10">

      {isLoading && (
        <div className="fixed top-5 left-5 bg-emerald-500/15 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
          <span>{language === 'ar' ? 'مزامنة مع السحاب...' : 'Syncing with Appwrite Cloud...'}</span>
        </div>
      )}

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
                      } else {
                        setActiveNoteId('');
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
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold">
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

          {filteredNotes.length > 0 && activeNoteId ? (
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
                  className="w-full flex-1 min-h-[300px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-mono"
                />
              </div>

              {/* Dynamic AI Diagnostic Panel below editor */}
              {aiFeedback && (
                <div className="p-6 bg-emerald-500/[0.02] border-t border-emerald-500/10 animate-fade-in space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4.5 w-4.5 text-emerald-500" />
                    <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                      {language === 'ar' ? `ملاحظات التقويم من النموذج النشط (${selectedModel})` : `Active AI Insight (${selectedModel})`}
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
