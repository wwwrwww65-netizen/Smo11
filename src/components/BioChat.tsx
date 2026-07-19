import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../AppContext';
import {
  Send,
  Sparkles,
  User,
  Cpu,
  Trash2,
  Loader2,
  Paperclip,
  FileText
} from 'lucide-react';
import {
  performBioAiAnalysis,
  getChatHistory,
  saveChatMessage,
  clearAllChatHistory,
  uploadFileToAppwrite,
  type ChatMessage
} from '../services/bioService';

export const BioChat: React.FC = () => {
  const { t, language, geminiKey } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats from Appwrite Database
  const fetchChats = useCallback(async () => {
    setIsAiAnalyzing(true);
    const history = await getChatHistory();
    if (history.length === 0) {
      const welcomeTxt = language === 'ar'
        ? `أهلاً بكِ في المساعد العلمي الذكي. يمكنكِ سؤالي عن أي دراسة علمية، تحليل عينة مجهرية، أو تلخيص للبحوث المعقدة.

**أمثلة على ما يمكنني القيام به:**
* تلخيص أوراق الـ PDF واستخراج مصفوفات التحليل.
* تفسير نتائج انقسام الخلايا وحساب المؤشرات الحيوية.
* تقديم فرضيات علمية حول مقاومة البكتيريا للمضادات.`
        : `Welcome to the intelligent Bio-Chat space. I am fully prepared to process complex genomic inquiries, summarize medical publications, or evaluate experimental data models.

**How I can assist you today:**
* Compress long scientific PDFs and parse core research variables.
* Explain mitotic anomalies or cell kinetics.
* Draft high-precision hypothesis structures for your wet-lab.`;
      
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: welcomeTxt,
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages(history);
    }
    setIsAiAnalyzing(false);
  }, [language]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt && !uploadedFile) return;

    let attachedName = undefined;
    let attachedType: 'image' | 'pdf' | undefined = undefined;
    let finalPrompt = prompt;

    setIsAiAnalyzing(true);

    if (uploadedFile) {
      setIsUploading(true);
      setUploadProgress(language === 'ar' ? 'جاري الرفع سحابياً...' : 'Uploading securely...');
      try {
        const uploadResult = await uploadFileToAppwrite(uploadedFile);
        attachedName = uploadedFile.name;
        attachedType = uploadedFile.type.includes('image') ? 'image' : 'pdf';
        finalPrompt += `\n\n[الملف المرفوع سحابياً: ${uploadResult.fileUrl}]`;
      } catch (err) {
        console.error("Upload error:", err);
        alert(language === 'ar' ? 'فشل رفع الملف إلى Appwrite Storage' : 'Failed to upload file to Appwrite storage bucket.');
        setIsUploading(false);
        setIsAiAnalyzing(false);
        return;
      }
      setIsUploading(false);
    }

    const userMessageText = prompt || (uploadedFile ? `[File Attachment: ${uploadedFile.name}]` : '');
    
    // Save User message to Appwrite Database
    await saveChatMessage('user', userMessageText);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
      attachmentName: attachedName,
      attachmentType: attachedType
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setUploadedFile(null);

    // Append AI placeholder
    const aiMessageId = `msg-ai-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMessageId,
      sender: 'assistant',
      text: '',
      timestamp: new Date(),
      isAiAnalyzing: true
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      // Execute Advanced Biological AI Analysis
      const responseText = await performBioAiAnalysis(finalPrompt, null, geminiKey);
      
      // Save Assistant message to Appwrite Database
      await saveChatMessage('assistant', responseText);

      setMessages((prev) =>
        prev.map((m) => m.id === aiMessageId ? { ...m, text: responseText, isAiAnalyzing: false } : m)
      );
    } catch (err) {
      console.error("AI service error:", err);
      const errMsg = language === 'ar' 
        ? "عذراً، حدث خطأ أثناء تشغيل التحليل. الرجاء التحقق من كود Gemini في الإعدادات."
        : "Error running analysis. Please verify your Gemini Key in Settings.";
      setMessages((prev) =>
        prev.map((m) => m.id === aiMessageId ? { ...m, text: errMsg, isAiAnalyzing: false } : m)
      );
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const clearChat = async () => {
    if (confirm(language === 'ar' ? 'هل أنتِ متأكدة من مسح سجل المحادثات بالكامل سحابياً؟' : 'Are you sure you want to permanently clear cloud chat history?')) {
      setIsAiAnalyzing(true);
      await clearAllChatHistory();
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: language === 'ar' ? 'تمت إعادة تهيئة الجلسة العلمية ومسح السجل سحابياً بنجاح.' : 'Scientific session restarted and cloud logs purged.',
          timestamp: new Date()
        }
      ]);
      setIsAiAnalyzing(false);
    }
  };

  const chips = [
    { textAr: "لخّص هذا البحث البيولوجي", textEn: "Summarize this research paper", value: "Summarize and parse the key metrics of this biological study." },
    { textAr: "مراحل انقسام الخلايا الميتوزي", textEn: "Phases of mitotic division", value: "What are the primary phases of mitotic cell division?" },
    { textAr: "فحص البكتيريا تحت المجهر", textEn: "Bacteria identification", value: "How do I identify Gram-negative bacteria under a compound microscope?" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] max-w-5xl mx-auto bg-white dark:bg-[#111827]/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden animate-fade-in relative z-10">

      {/* Header of Bio-Chat */}
      <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">
              {t.bioChat}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'ar' ? 'متصل بقاعدة بيانات Appwrite' : 'Synchronized with Appwrite cloud DB'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
          title="Clear Session"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages Feed area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-4xl ${msg.sender === 'user' ? 'flex-row-reverse self-end justify-start text-right' : 'justify-start text-left'}`}
          >

            {/* Avatar */}
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
              msg.sender === 'user'
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                : 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 text-emerald-500'
            }`}>
              {msg.sender === 'user' ? <User className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
            </div>

            {/* Bubble body */}
            <div className={`space-y-2 max-w-[85%] rounded-2xl p-5 border shadow-sm ${
              msg.sender === 'user'
                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 text-slate-800 dark:text-slate-100'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/80 text-slate-800 dark:text-slate-100'
            }`}>

              {/* Attachments preview */}
              {msg.attachmentName && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold truncate">{msg.attachmentName}</span>
                </div>
              )}

              {msg.isAiAnalyzing ? (
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-emerald-500" />
                  <span>{language === 'ar' ? 'جاري الفحص واستخلاص النتائج الحيوية...' : 'Sequencing context & evaluating bio-data...'}</span>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips */}
      <div className="px-6 py-2.5 flex flex-wrap gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/20">
        <span className="text-xs text-slate-400 flex items-center mr-2 self-center font-semibold">
          {t.suggestedQuestions}:
        </span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.value)}
            disabled={isAiAnalyzing}
            className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-emerald-500/10 dark:bg-slate-800 dark:hover:bg-emerald-500/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-700/80 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            {language === 'ar' ? chip.textAr : chip.textEn}
          </button>
        ))}
      </div>

      {/* Input panel */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
        <div className="relative flex items-center gap-3">

          {/* File picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAiAnalyzing}
            className={`p-3 rounded-xl border bg-white dark:bg-[#111827] text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all ${
              uploadedFile ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-700'
            }`}
            title="Attach Document / Research PDF"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/*"
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isAiAnalyzing}
            placeholder={uploadedFile ? `📎 Attached: ${uploadedFile.name} | Click send to upload & analyze` : t.chatPlaceholder}
            className="flex-1 px-4 py-3.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 dark:text-slate-100 placeholder-slate-400 transition-all"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={isAiAnalyzing || (!inputValue.trim() && !uploadedFile)}
            className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-medium transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center shrink-0"
          >
            {isAiAnalyzing ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-5 w-5 animate-spin" />
                {isUploading && <span className="text-[10px]">{uploadProgress}</span>}
              </div>
            ) : (
              <Send className="h-5 w-5 transform rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
