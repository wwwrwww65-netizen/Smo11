import { Client, Databases, Storage, Account, ID, Query } from 'appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded default Appwrite configurations for stability & production
export const DEFAULT_APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const DEFAULT_APPWRITE_PROJECT_ID = '6a5c48fb00236c305a1c';
export const DEFAULT_APPWRITE_DATABASE_ID = '6a5c43ce003718f2ed71';
export const DEFAULT_APPWRITE_STORAGE_BUCKET_ID = '6a5c4e1c001a2be6ae0d';

// Default Gemini API key provided by the user
export const DEFAULT_GEMINI_KEY = 'AQ.Ab8RN6Jt2WHp-x_exlAVz7I_CcvLiad2JHZ6ODgX152sXpz-Pw';

// Helper getters to retrieve dynamic configurations from LocalStorage or fallback to defaults
export const getAppwriteEndpoint = (): string => {
  return localStorage.getItem('appwrite_endpoint') || DEFAULT_APPWRITE_ENDPOINT;
};

export const getAppwriteProjectId = (): string => {
  return localStorage.getItem('appwrite_project_id') || DEFAULT_APPWRITE_PROJECT_ID;
};

export const getAppwriteDatabaseId = (): string => {
  return localStorage.getItem('appwrite_database_id') || DEFAULT_APPWRITE_DATABASE_ID;
};

export const getAppwriteStorageBucketId = (): string => {
  return localStorage.getItem('appwrite_storage_bucket_id') || DEFAULT_APPWRITE_STORAGE_BUCKET_ID;
};

export const getGeminiApiKey = (): string => {
  return localStorage.getItem('gemini_key') || DEFAULT_GEMINI_KEY;
};

// Initialize Appwrite Client singleton
const client = new Client();
// Set initial endpoint and project ID
client.setEndpoint(getAppwriteEndpoint()).setProject(getAppwriteProjectId());

export const appwriteDatabases = new Databases(client);
export const appwriteStorage = new Storage(client);
export const appwriteAccount = new Account(client);

// Update client endpoint and project ID dynamically when saved/changed
export const reinitAppwriteClient = (): void => {
  client.setEndpoint(getAppwriteEndpoint()).setProject(getAppwriteProjectId());
};

// Ensure session exists (Anonymous session support)
export const initAppwriteSession = async (): Promise<void> => {
  reinitAppwriteClient();
  try {
    await appwriteAccount.get();
  } catch {
    try {
      await appwriteAccount.createAnonymousSession();
    } catch (err) {
      console.error("Failed to establish Appwrite anonymous session", err);
      throw err;
    }
  }
};

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  attachmentName?: string;
  attachmentType?: 'image' | 'pdf';
  isAiAnalyzing?: boolean;
}

export interface ProjectFolder {
  id: string;
  nameAr: string;
  nameEn: string;
  created: string;
  notesCount: number;
}

export interface ResearchNote {
  id: string;
  projectId: string; // mapped to 'category' in Appwrite
  title: string;
  content: string;
  updatedAt: string;
}

// --------------------------------------------------
// APPWRITE DB & STORAGE INTERACTIONS
// --------------------------------------------------

// Chat History integration
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    await initAppwriteSession();
    const response = await appwriteDatabases.listDocuments(
      getAppwriteDatabaseId(),
      'chat_history',
      [Query.orderAsc('$createdAt'), Query.limit(100)]
    );
    return response.documents.map((doc: any) => ({
      id: doc.$id,
      sender: doc.sender === 'assistant' ? 'assistant' : 'user',
      text: doc.message || '',
      timestamp: new Date(doc.$createdAt)
    }));
  } catch (err) {
    console.error("Failed to load chat history from Appwrite", err);
    throw err;
  }
};

export const saveChatMessage = async (sender: 'user' | 'assistant', message: string): Promise<void> => {
  try {
    await initAppwriteSession();
    await appwriteDatabases.createDocument(
      getAppwriteDatabaseId(),
      'chat_history',
      ID.unique(),
      {
        sender,
        message
      }
    );
  } catch (err) {
    console.error("Failed to write message to Appwrite", err);
    throw err;
  }
};

export const clearAllChatHistory = async (): Promise<void> => {
  try {
    await initAppwriteSession();
    const response = await appwriteDatabases.listDocuments(
      getAppwriteDatabaseId(),
      'chat_history',
      [Query.limit(100)]
    );
    for (const doc of response.documents) {
      await appwriteDatabases.deleteDocument(getAppwriteDatabaseId(), 'chat_history', doc.$id);
    }
  } catch (err) {
    console.error("Failed to clear chat history", err);
    throw err;
  }
};

// Lab Notes integration
export const getLabNotes = async (): Promise<ResearchNote[]> => {
  try {
    await initAppwriteSession();
    const response = await appwriteDatabases.listDocuments(
      getAppwriteDatabaseId(),
      'lab_notes',
      [Query.limit(100)]
    );
    return response.documents.map((doc: any) => ({
      id: doc.$id,
      projectId: doc.category || 'General',
      title: doc.title || '',
      content: doc.content || '',
      updatedAt: new Date(doc.$updatedAt || doc.$createdAt).toISOString().split('T')[0]
    }));
  } catch (err) {
    console.error("Failed to retrieve lab notes", err);
    throw err;
  }
};

export const createLabNote = async (title: string, content: string, category: string): Promise<ResearchNote> => {
  try {
    await initAppwriteSession();
    const response = await appwriteDatabases.createDocument(
      getAppwriteDatabaseId(),
      'lab_notes',
      ID.unique(),
      {
        title,
        content,
        category
      }
    );
    return {
      id: response.$id,
      projectId: response.category,
      title: response.title,
      content: response.content,
      updatedAt: new Date(response.$updatedAt).toISOString().split('T')[0]
    };
  } catch (err) {
    console.error("Failed to construct lab note", err);
    throw err;
  }
};

export const updateLabNote = async (noteId: string, title: string, content: string, category: string): Promise<void> => {
  try {
    await initAppwriteSession();
    await appwriteDatabases.updateDocument(
      getAppwriteDatabaseId(),
      'lab_notes',
      noteId,
      {
        title,
        content,
        category
      }
    );
  } catch (err) {
    console.error("Failed to update lab note in database", err);
    throw err;
  }
};

export const deleteLabNote = async (noteId: string): Promise<void> => {
  try {
    await initAppwriteSession();
    await appwriteDatabases.deleteDocument(
      getAppwriteDatabaseId(),
      'lab_notes',
      noteId
    );
  } catch (err) {
    console.error("Failed to remove lab note", err);
    throw err;
  }
};

// Storage integration
export const uploadFileToAppwrite = async (file: File): Promise<{ fileId: string; fileUrl: string }> => {
  try {
    await initAppwriteSession();
    const response = await appwriteStorage.createFile(
      getAppwriteStorageBucketId(),
      ID.unique(),
      file
    );
    const fileUrl = appwriteStorage.getFileView(getAppwriteStorageBucketId(), response.$id).toString();
    return {
      fileId: response.$id,
      fileUrl
    };
  } catch (err) {
    console.error("Appwrite cloud file storage upload failure", err);
    throw err;
  }
};

// --------------------------------------------------
// AI BIO & VISION ANALYSIS ASSISTANT
// --------------------------------------------------
export const performBioAiAnalysis = async (
  prompt: string,
  imageFile: File | null,
  apiKey: string
): Promise<string> => {
  const keyToUse = (apiKey && apiKey.trim() !== '') ? apiKey.trim() : getGeminiApiKey();
  try {
    const ai = new GoogleGenerativeAI(keyToUse);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (imageFile) {
      const fileToGenerativePart = async (file: File) => {
        return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            resolve({
              inlineData: {
                data: base64Data,
                mimeType: file.type
              }
            });
          };
          reader.readAsDataURL(file);
        });
      };

      const imagePart = await fileToGenerativePart(imageFile);
      const result = await model.generateContent([
        `You are the highly advanced, world-class biological assistant "Princess Scientist Platform (العالمة سمو الأميرة)".
         Analyze this microscope/biological image based on this prompt: "${prompt}".
         Respond in Arabic or English based on the language of the prompt or standard scientific language.
         Provide extremely detailed, professional, structured, and peer-reviewed biological feedback. Use markdown.`,
        imagePart
      ]);
      return result.response.text();
    } else {
      const result = await model.generateContent(
        `You are the highly advanced, world-class biological assistant "Princess Scientist Platform (العالمة سمو الأميرة)".
         Analyze the following inquiry as a world-class biologist/bioinformatician: "${prompt}".
         Respond in Arabic or English based on the language of the prompt or standard scientific language.
         Provide an extremely detailed, professional, structured, and peer-reviewed biological feedback. Use markdown.`
      );
      return result.response.text();
    }
  } catch (err) {
    console.error("Error executing Gemini analysis:", err);
    throw err;
  }
};

// --------------------------------------------------
// DIAGNOSTIC CONNECTIONS VERIFICATION
// --------------------------------------------------
export interface DiagnosticResult {
  session: { success: boolean; message: string };
  database: { success: boolean; message: string };
  storage: { success: boolean; message: string };
  gemini: { success: boolean; message: string };
}

export const runFullDiagnostics = async (
  endpoint: string,
  project: string,
  database: string,
  bucket: string,
  geminiKey: string
): Promise<DiagnosticResult> => {
  // Setup temporary test client
  const testClient = new Client()
    .setEndpoint(endpoint || DEFAULT_APPWRITE_ENDPOINT)
    .setProject(project || DEFAULT_APPWRITE_PROJECT_ID);

  const testAccount = new Account(testClient);
  const testDatabases = new Databases(testClient);
  const testStorage = new Storage(testClient);

  const result: DiagnosticResult = {
    session: { success: false, message: 'Not started' },
    database: { success: false, message: 'Not started' },
    storage: { success: false, message: 'Not started' },
    gemini: { success: false, message: 'Not started' }
  };

  // Helper to construct highly informative bilingual diagnostics messages
  const parseAppwriteError = (err: any): string => {
    const rawMsg = err.message || String(err);
    if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError') || rawMsg.includes('fetch')) {
      return `Failed to fetch (CORS / Web Platform Blocked).
Arabic: ⚠️ هذا الخطأ يعني أن متصفحك يمنع الاتصال بخوادم Appwrite بسبب قيود الحماية (CORS). لحل هذه المشكلة، يجب عليك تسجيل رابط موقعك الحالي (مثلاً http://localhost:5173 أو نطاق الاستضافة الخاص بك) كمنصة ويب (Web Platform) في لوحة تحكم مشروع Appwrite (إعدادات المشروع -> المنصات Platforms -> إضافة Web App).
English: ⚠️ This indicates a CORS / Web Platform block. To resolve this, you must add your current domain (e.g., http://localhost:5173 or your production URL) as a Web Platform in your Appwrite Project Settings under the "Platforms" section.`;
    }
    if (rawMsg.includes('project_not_found') || rawMsg.includes('404')) {
      return `Project Not Found (404 Error).
Arabic: ⚠️ معرّف المشروع (Project ID) الذي أدخلته غير موجود على خادم Appwrite السحابي. يرجى التأكد من كتابة الـ Project ID بدقة تامة من لوحة تحكم Appwrite.
English: ⚠️ The Appwrite Project ID you provided was not found on the server. Please verify you copied the exact Project ID from your Appwrite console.`;
    }
    return rawMsg;
  };

  const parseGeminiError = (err: any): string => {
    const rawMsg = err.message || String(err);
    if (rawMsg.includes('401') || rawMsg.includes('authentication credentials') || rawMsg.includes('API key') || rawMsg.includes('UNAUTHENTICATED')) {
      return `Invalid Gemini Credentials (401 Error).
Arabic: ⚠️ مفتاح Gemini API Key المدخل غير صالح أو انتهت صلاحيته. المفاتيح الرسمية لـ Gemini تبدأ عادةً بـ "AIzaSy". المفتاح الحالي الذي يبدأ بـ "${(geminiKey || DEFAULT_GEMINI_KEY).substring(0, 5)}..." لا يبدو بصيغة صحيحة. يرجى إنشاء مفتاح جديد وصالح من منصة Google AI Studio.
English: ⚠️ The Gemini API key provided is invalid or has expired. Standard Gemini API keys must start with "AIzaSy". Your key starts with "${(geminiKey || DEFAULT_GEMINI_KEY).substring(0, 5)}...", which is invalid. Please create a new valid API key from Google AI Studio.`;
    }
    return rawMsg;
  };

  // 1. Session Test
  try {
    try {
      await testAccount.get();
    } catch {
      await testAccount.createAnonymousSession();
    }
    result.session = { success: true, message: 'Successfully established Anonymous Session.' };
  } catch (err: any) {
    result.session = { success: false, message: parseAppwriteError(err) };
    result.database = { success: false, message: 'Database check skipped due to session failure.' };
    result.storage = { success: false, message: 'Storage check skipped due to session failure.' };
  }

  // 2. Database Test
  if (result.session.success) {
    try {
      // Attempt to list chat history docs to verify DB connection
      await testDatabases.listDocuments(database || DEFAULT_APPWRITE_DATABASE_ID, 'chat_history', [Query.limit(1)]);
      result.database = { success: true, message: 'Database connected and chat_history table is accessible.' };
    } catch (err: any) {
      result.database = { success: false, message: parseAppwriteError(err) };
    }
  }

  // 3. Storage Test
  if (result.session.success) {
    try {
      await testStorage.listFiles(bucket || DEFAULT_APPWRITE_STORAGE_BUCKET_ID, [Query.limit(1)]);
      result.storage = { success: true, message: 'Storage Bucket connected and accessible.' };
    } catch (err: any) {
      result.storage = { success: false, message: parseAppwriteError(err) };
    }
  }

  // 4. Gemini Test
  try {
    const aiKey = geminiKey || DEFAULT_GEMINI_KEY;
    const ai = new GoogleGenerativeAI(aiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent("Ping");
    if (response.response.text()) {
      result.gemini = { success: true, message: 'Gemini API verified successfully.' };
    } else {
      result.gemini = { success: false, message: 'Gemini API responded with an empty body.' };
    }
  } catch (err: any) {
    result.gemini = { success: false, message: parseGeminiError(err) };
  }

  return result;
};
