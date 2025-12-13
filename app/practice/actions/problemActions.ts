'use server';

import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  getDocs,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { calculateNextReview, getNextReviewUpdate } from '../utils/spacedRepetition';
import type { Problem, ProblemFormData } from '../types';

/**
 * Server Action: Load all problems for a user
 */
export async function loadProblemsAction(userId: string): Promise<Problem[]> {
  if (!userId) {
    console.error('No userId provided to loadProblemsAction');
    return [];
  }

  try {
    console.log('Loading problems for userId:', userId);
    
    const q = query(
      collection(db, 'problems'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    console.log('Found problems:', snapshot.docs.length);
    
    const problems = snapshot.docs.map((doc) => {
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
    
    // Sort in JavaScript instead of Firestore to avoid needing composite index
    problems.sort((a, b) => b.solvedDate.localeCompare(a.solvedDate));
    
    console.log('Returning problems:', problems);
    return problems;
  } catch (error: any) {
    console.error('Error loading problems:', {
      error: error?.message || String(error),
      code: error?.code,
      userId,
      stack: error?.stack,
    });
    return [];
  }
}

/**
 * Server Action: Add a new problem
 */
export async function addProblemAction(
  userId: string,
  data: ProblemFormData
): Promise<Problem | null> {
  if (!userId) {
    console.error('No userId provided to addProblemAction');
    return null;
  }

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

    const docRef = await addDoc(
      collection(db, 'problems'),
      problemData
    );

    return { id: docRef.id, ...problemData } as Problem;
  } catch (error: any) {
    console.error('Error adding problem:', {
      error: error?.message || String(error),
      code: error?.code,
      userId,
    });
    return null;
  }
}

/**
 * Server Action: Delete a problem
 */
export async function deleteProblemAction(
  userId: string,
  problemId: string
): Promise<boolean> {
  if (!userId || !problemId) {
    console.error('Missing userId or problemId in deleteProblemAction');
    return false;
  }

  try {'problems', problemId
    await deleteDoc(doc(db, `users/${userId}/problems/${problemId}`));
    return true;
  } catch (error: any) {
    console.error('Error deleting problem:', {
      error: error?.message || String(error),
      code: error?.code,
      userId,
      problemId,
    });
    return false;
  }
}

/**
 * Server Action: Mark problem as reviewed
 */
export async function markAsReviewedAction(
  userId: string,
  problemId: string,
  currentReviewCount: number
): Promise<{ reviewCount: number; nextReviewDate: string | null; neuralPathwayCreated: boolean } | null> {
  if (!userId || !problemId) {
    console.error('Missing userId or problemId in markAsReviewedAction');
    return null;
  }

  try {
    const updates = getNextReviewUpdate(currentReviewCount);
    
    await updateDoc(
      doc(db, 'problems', problemId),
      updates
    );

    return updates;
  } catch (error: any) {
    console.error('Error marking as reviewed:', {
      error: error?.message || String(error),
      code: error?.code,
      userId,
      problemId,
    });
    return null;
  }
}
