import { Client, Databases, Storage, Account } from 'appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Appwrite Client lazily or dynamically
export const getAppwriteClient = (endpoint: string, projectId: string) => {
  if (!endpoint || !projectId) return null;
  try {
    const client = new Client();
    client.setEndpoint(endpoint).setProject(projectId);
    return {
      client,
      databases: new Databases(client),
      storage: new Storage(client),
      account: new Account(client),
    };
  } catch (err) {
    console.error("Failed to initialize Appwrite client", err);
    return null;
  }
};

// Bio-Intelligence Analysis Assistant simulation responses
const BIOLOGICAL_KNOWLEDGE_BASE = {
  mitosis: `### 🔬 Mitotic Cell Division Analysis

Based on your inquiry, **Mitosis** is a fundamental process where a single cell divides into two identical daughter cells. Here is a scientific overview:

1. **Prophase**: Chromatin condenses into visible chromosomes. The nucleolus disappears, and the mitotic spindle begins to form.
2. **Metaphase**: Chromosomes line up perfectly along the metaphase plate. Spindle fibers attach to the kinetochores.
3. **Anaphase**: Sister chromatids are pulled apart by the spindle fibers toward opposite poles of the cell.
4. **Telophase**: Nuclear envelopes reform around the two new nuclei, and chromosomes begin to decondense.

**Clinical/Research Significance:**
Understanding mitotic indices is crucial in oncological research to assess tumor proliferation rates.`,

  gram: `### 🧫 Gram-Negative Bacteria Microscopic Identification

Identifying Gram-negative bacteria requires a structured staining procedure and high-zoom brightfield microscopy (1000x with oil immersion):

* **Color Outcome**: Gram-negative bacteria appear **pink/red** under the microscope due to their thin peptidoglycan layer and outer membrane which fails to retain the crystal violet-iodine complex, absorbing the **Safranin counterstain**.
* **Cellular Morphology**: Common structures include:
  - *Bacilli* (rod-shaped, e.g., *Escherichia coli*, *Pseudomonas aeruginosa*)
  - *Cocci* (spherical, e.g., *Neisseria gonorrhoeae*)
* **Important Characteristics**: They possess a lipopolysaccharide (LPS) outer membrane which acts as an endotoxin, making them clinically challenging due to high antibiotic resistance.`,

  summarize: `### 📄 Scientific Document Summary & Insights
**Document Ref:** *Mitochondrial DNA (mtDNA) & Cell Metabolism Regulation*

**Key Discoveries & Findings:**
1. **Oxidative Phosphorylation**: The paper outlines how mitochondrial respiratory chain complexes are modulated during stress, leading to a 34% increase in reactive oxygen species (ROS) production.
2. **Genetic Mutations**: Points to a correlation between MT-ND1 gene polymorphisms and cellular senescence in vascular tissue.
3. **AI Projections**: Applying machine learning algorithms to mitochondrial morphology yields a 91.4% accuracy in predicting metabolic shifts.

**Recommendation for Future Wet-Lab Steps:**
We recommend performing a Western blot assay targeting Complex IV subunits to confirm translational regulation.`,

  generic: `### 🧬 Biological Analysis Report
Thank you for your inquiry. Here is the AI-generated biological assessment based on advanced cellular research patterns:

* **Inquiry/Topic:** Bio-Systems Modeling & Cell Viability
* **Scientific Insights:** Recent publications suggest that microfluidic organ-on-a-chip models provide highly realistic tissue microenvironments, allowing for real-time tracking of drug absorption rates.
* **Suggested Next Experiment:** Consider running a fluorescence-based live/dead cell assay (Calcein AM/Ethidium Homodimer-1) to quantify cell survival rate over 48 hours.

*Developed under the guidance of the Her Highness Scientist workspace.*`
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

// Main service to perform biological computations and AI analysis
export const performBioAiAnalysis = async (
  prompt: string,
  imageFile: File | null,
  apiKey: string
): Promise<string> => {
  // If API key is provided, attempt real Gemini call
  if (apiKey && apiKey.trim() !== "") {
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: imageFile ? 'gemini-1.5-flash' : 'gemini-1.5-flash' });

      let response;
      if (imageFile) {
        // Convert file to Generative Part
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
          `You are the highly advanced, world-class biological assistant "Her Highness Scientist Platform (Bio-Workspace AI)".
           Analyze this microscope/biological image based on this prompt: "${prompt}".
           Provide extremely detailed, professional, structured and peer-reviewed biological feedback. Use markdown.`,
          imagePart
        ]);
        response = result.response.text();
      } else {
        const result = await model.generateContent(
          `You are the highly advanced, world-class biological assistant "Her Highness Scientist Platform (Bio-Workspace AI)".
           Analyze the following inquiry as a world-class biologist/bioinformatician: "${prompt}".
           Provide an extremely detailed, professional, structured and peer-reviewed biological feedback. Use markdown.`
        );
        response = result.response.text();
      }
      return response;
    } catch (err) {
      console.error("Error calling Gemini API, falling back to Intelligent Mock Logic:", err);
    }
  }

  // High-fidelity Bio-Mock Logic (Demo Mode / Fallback)
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      if (lower.includes('mitosis') || lower.includes('انقسام') || lower.includes('ميتوزي')) {
        resolve(BIOLOGICAL_KNOWLEDGE_BASE.mitosis);
      } else if (lower.includes('gram') || lower.includes('غرام') || lower.includes('بكتيريا')) {
        resolve(BIOLOGICAL_KNOWLEDGE_BASE.gram);
      } else if (lower.includes('summarize') || lower.includes('ملخص') || lower.includes('بحث') || lower.includes('لخص')) {
        resolve(BIOLOGICAL_KNOWLEDGE_BASE.summarize);
      } else {
        resolve(BIOLOGICAL_KNOWLEDGE_BASE.generic);
      }
    }, 1500); // Simulate network latency and premium computation
  });
};

// Simulated Database / Appwrite storage local state
export interface ProjectFolder {
  id: string;
  nameAr: string;
  nameEn: string;
  created: string;
  notesCount: number;
}

export interface ResearchNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export const initialProjects: ProjectFolder[] = [
  { id: 'proj-1', nameAr: 'انقسام الخلايا الميتوزي', nameEn: 'Mitotic Cell Division Studies', created: '2025-02-15', notesCount: 3 },
  { id: 'proj-2', nameAr: 'تأثير المضادات الحيوية', nameEn: 'Antibiotic Sensitivity Profiling', created: '2025-02-20', notesCount: 2 },
  { id: 'proj-3', nameAr: 'تنسيق الميتوكوندريا', nameEn: 'Mitochondrial Bioenergetics', created: '2025-02-28', notesCount: 1 }
];

export const initialNotes: ResearchNote[] = [
  {
    id: 'note-1',
    projectId: 'proj-1',
    title: 'Observation of Prophase in Allium cepa',
    content: `### 🧅 Experiment Log: Onion Root Tip Mitosis
**Date:** February 15, 2025
**Objective:** Observe chromosomes in onion root tip cell division.

#### 🧫 Protocol:
1. Fix onion roots in Carnoy's fluid for 24 hours.
2. Hydrolyze in 1N HCl at 60°C for 5 minutes.
3. Stain with Acetocarmine for 10 minutes.
4. Squash carefully on a clean slide.

#### 📊 Quantitative Observations:
| Phase | Count | Percentage (%) |
|---|---|---|
| Interphase | 142 | 71.0% |
| Prophase | 24 | 12.0% |
| Metaphase | 18 | 9.0% |
| Anaphase | 11 | 5.5% |
| Telophase | 5 | 2.5% |

#### 🔬 Discussion:
The mitotic index is calculated to be **29%**, indicating high proliferation within the meristematic zone. Cells display beautiful chromosome condensation in early prophase, and the nuclear envelope is noticeably absent in late stages.`,
    updatedAt: '2025-02-15'
  },
  {
    id: 'note-2',
    projectId: 'proj-1',
    title: 'AI Assisted Mitotic Index Analysis',
    content: `### 🤖 Automated Cell Analysis & Validation
**Date:** February 18, 2025
*Analyzed via Vision Lab Deep Learning Models*

* **Total Counted Cells:** 200
* **Identified Dividing Cells:** 58
* **Anomalous Structures Detected:** 2 chromosomal bridges in anaphase, suggesting possible chemical mutation.

**Conclusion:** The sample exhibits accelerated karyokinesis, aligned with controls treated with light cytokine boosters.`,
    updatedAt: '2025-02-18'
  },
  {
    id: 'note-3',
    projectId: 'proj-2',
    title: 'E. Coli Penicillin Resistance Matrix',
    content: `### 🧫 Zone of Inhibition Study
**Date:** February 22, 2025
**Target Strain:** *Escherichia coli* (ATCC 25922)

#### 📝 Results:
* **Penicillin (10µg):** 4mm (Resistant)
* **Ampicillin (10µg):** 16mm (Intermediate)
* **Ciprofloxacin (5µg):** 28mm (Highly Sensitive)

**Discussion:** Gram-negative membrane acts as a powerful barrier against classic beta-lactams. Use of outer-membrane permeabilizers is highly recommended to restore penicillin efficiency.`,
    updatedAt: '2025-02-22'
  }
];
