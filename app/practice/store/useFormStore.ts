import { create } from 'zustand';

interface FormState {
  // Form fields
  url: string;
  title: string;
  notes: string;
  description: string;
  solvedDate: string;
  neuralPathwayCreated: boolean;
  patterns: string;
  difficulty: string;
  loading: boolean;

  // Actions
  setUrl: (url: string) => void;
  setTitle: (title: string) => void;
  setNotes: (notes: string) => void;
  setDescription: (description: string) => void;
  setSolvedDate: (date: string) => void;
  setNeuralPathwayCreated: (created: boolean) => void;
  setPatterns: (patterns: string) => void;
  setDifficulty: (difficulty: string) => void;
  setLoading: (loading: boolean) => void;
  setAutoFilledData: (data: { title: string; difficulty: string; patterns: string; description: string }) => void;
  resetForm: () => void;
}

const initialState = {
  url: '',
  title: '',
  notes: '',
  description: '',
  solvedDate: new Date().toISOString().split('T')[0],
  neuralPathwayCreated: false,
  patterns: '',
  difficulty: '',
  loading: false,
};

export const useFormStore = create<FormState>((set) => ({
  ...initialState,

  // Actions
  setUrl: (url) => set({ url }),
  setTitle: (title) => set({ title }),
  setNotes: (notes) => set({ notes }),
  setDescription: (description) => set({ description }),
  setSolvedDate: (solvedDate) => set({ solvedDate }),
  setNeuralPathwayCreated: (neuralPathwayCreated) => set({ neuralPathwayCreated }),
  setPatterns: (patterns) => set({ patterns }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setLoading: (loading) => set({ loading }),
  
  setAutoFilledData: (data) => set({
    title: data.title,
    difficulty: data.difficulty,
    patterns: data.patterns,
    description: data.description,
  }),

  resetForm: () => set({
    ...initialState,
    solvedDate: new Date().toISOString().split('T')[0], // Always use current date
  }),
}));
