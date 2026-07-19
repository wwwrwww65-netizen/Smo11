import { Client, Databases, Storage, Account, ID, Query } from 'appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded Appwrite configurations for stability & production
export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6a5c48fb00236c305a1c';
export const APPWRITE_DATABASE_ID = '6a5c43ce003718f2ed71';
export const APPWRITE_STORAGE_BUCKET_ID = '6a5c4e1c001a2be6ae0d';

// Default Gemini API key provided by the user
export const DEFAULT_GEMINI_KEY = 'AQ.Ab8RN6Jt2WHp-x_exlAVz7I_CcvLiad2JHZ6ODgX152sXpz-Pw';

// Initialize Appwrite Client singletons
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const appwriteDatabases = new Databases(client);
export const appwriteStorage = new Storage(client);
export const appwriteAccount = new Account(client);

// Ensure session exists (Anonymous session support)
export const initAppwriteSession = async (): Promise<void> => {
  try {
    await appwriteAccount.get();
  } catch {
    try {
      await appwriteAccount.createAnonymousSession();
    } catch (err) {
      console.error("Failed to establish Appwrite anonymous session", err);
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
  await initAppwriteSession();
  try {
    const response = await appwriteDatabases.listDocuments(
      APPWRITE_DATABASE_ID,
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
    return [];
  }
};

export const saveChatMessage = async (sender: 'user' | 'assistant', message: string): Promise<void> => {
  await initAppwriteSession();
  try {
    await appwriteDatabases.createDocument(
      APPWRITE_DATABASE_ID,
      'chat_history',
      ID.unique(),
      {
        sender,
        message
      }
    );
  } catch (err) {
    console.error("Failed to write message to Appwrite", err);
  }
};

export const clearAllChatHistory = async (): Promise<void> => {
  await initAppwriteSession();
  try {
    const response = await appwriteDatabases.listDocuments(
      APPWRITE_DATABASE_ID,
      'chat_history',
      [Query.limit(100)]
    );
    for (const doc of response.documents) {
      await appwriteDatabases.deleteDocument(APPWRITE_DATABASE_ID, 'chat_history', doc.$id);
    }
  } catch (err) {
    console.error("Failed to clear chat history", err);
  }
};

// Lab Notes integration
export const getLabNotes = async (): Promise<ResearchNote[]> => {
  await initAppwriteSession();
  try {
    const response = await appwriteDatabases.listDocuments(
      APPWRITE_DATABASE_ID,
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
    return [];
  }
};

export const createLabNote = async (title: string, content: string, category: string): Promise<ResearchNote> => {
  await initAppwriteSession();
  try {
    const response = await appwriteDatabases.createDocument(
      APPWRITE_DATABASE_ID,
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
  await initAppwriteSession();
  try {
    await appwriteDatabases.updateDocument(
      APPWRITE_DATABASE_ID,
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
  await initAppwriteSession();
  try {
    await appwriteDatabases.deleteDocument(
      APPWRITE_DATABASE_ID,
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
  await initAppwriteSession();
  try {
    const response = await appwriteStorage.createFile(
      APPWRITE_STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );
    const fileUrl = appwriteStorage.getFileView(APPWRITE_STORAGE_BUCKET_ID, response.$id).toString();
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
  const keyToUse = (apiKey && apiKey.trim() !== '') ? apiKey.trim() : DEFAULT_GEMINI_KEY;
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
