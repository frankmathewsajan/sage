import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Problem, ProblemFormData } from '../types';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  getDocs 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { calculateNextReview, getNextReviewUpdate } from '../utils/spacedRepetition';

interface PracticeState {
  // State
  problems: Problem[];
  loading: boolean;
  showForm: boolean;
  
  // Actions
  setShowForm: (show: boolean) => void;
  loadProblems: (userId: string) => Promise<void>;
  addProblem: (userId: string, data: ProblemFormData) => Promise<void>;
  deleteProblem: (userId: string, problemId: string) => Promise<void>;
  markAsReviewed: (userId: string, problemId: string, currentReviewCount: number) => Promise<void>;
}

export const usePracticeStore = create<PracticeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        problems: [],
        loading: false,
        showForm: false,

        // Actions
        setShowForm: (show) => set({ showForm: show }),

        loadProblems: async (userId: string) => {
          console.log('Store: loadProblems called with userId:', userId);
          set({ loading: true });
          try {
            const q = query(
              collection(db, 'problems'),
              where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            const loadedProblems = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                url: data.url || '',
                title: data.title || '',
                notes: data.notes || '',
                description: data.description || '',
                solvedDate: data.solvedDate || '',
                neuralPathwayCreated: data.neuralPathwayCreated || false,
                pattern: data.pattern || '',
                reviewCount: data.reviewCount || 0,
                nextReviewDate: data.nextReviewDate || null,
                createdAt: data.createdAt || '',
              };
            }) as Problem[];
            
            loadedProblems.sort((a, b) => b.solvedDate.localeCompare(a.solvedDate));
            console.log('Store: received problems:', loadedProblems.length);
            set({ problems: loadedProblems });
          } catch (error) {
            console.error('Store: Error loading problems:', error);
          } finally {
            set({ loading: false });
          }
        },

        addProblem: async (userId: string, data: ProblemFormData) => {
          try {
            const nextReviewDate = calculateNextReview(
              data.solvedDate,
              0,
              data.neuralPathwayCreated
            );

            const problemData = {
              userId,
              url: data.url || '',
              title: data.title || '',
              notes: data.notes || '',
              description: data.description || '',
              solvedDate: data.solvedDate || new Date().toISOString().split('T')[0],
              neuralPathwayCreated: data.neuralPathwayCreated || false,
              pattern: data.pattern || '',
              reviewCount: 0,
              nextReviewDate,
              createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'problems'), problemData);
            const newProblem = { id: docRef.id, ...problemData } as Problem;
            
            set((state) => ({ 
              problems: [newProblem, ...state.problems],
              showForm: false 
            }));
          } catch (error) {
            console.error('Error adding problem:', error);
          }
        },

        deleteProblem: async (userId: string, problemId: string) => {
          if (!confirm('Are you sure you want to delete this problem?')) {
            return;
          }

          try {
            await deleteDoc(doc(db, 'problems', problemId));
            set((state) => ({
              problems: state.problems.filter((p) => p.id !== problemId),
            }));
          } catch (error) {
            console.error('Error deleting problem:', error);
          }
        },

        markAsReviewed: async (userId: string, problemId: string, currentReviewCount: number) => {
          try {
            const updates = getNextReviewUpdate(currentReviewCount);
            await updateDoc(doc(db, 'problems', problemId), updates);
            
            set((state) => ({
              problems: state.problems.map((p) =>
                p.id === problemId ? { ...p, ...updates } : p
              ),
            }));
          } catch (error) {
            console.error('Error marking as reviewed:', error);
          }
        },
      }),
      {
        name: 'practice-storage',
        partialize: (state) => ({ 
          // Only persist problems, not loading or showForm
          problems: state.problems 
        }),
      }
    )
  )
);
