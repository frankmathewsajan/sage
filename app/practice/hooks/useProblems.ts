import { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Problem, ProblemFormData } from "../types";
import { calculateNextReview, getNextReviewUpdate } from "../utils/spacedRepetition";

export function useProblems(userId: string | undefined) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadProblems() {
    if (!userId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "problems"),
        where("userId", "==", userId),
        orderBy("solvedDate", "desc")
      );
      const snapshot = await getDocs(q);
      const loadedProblems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Problem[];
      setProblems(loadedProblems);
    } catch (error) {
      console.error("Error loading problems:", error);
    }
    setLoading(false);
  }

  async function addProblem(formData: ProblemFormData) {
    if (!userId) return;
    
    const nextReviewDate = calculateNextReview(
      formData.solvedDate,
      0,
      formData.neuralPathwayCreated
    );

    await addDoc(collection(db, "problems"), {
      ...formData,
      userId,
      nextReviewDate,
      reviewCount: 0,
    });
    
    await loadProblems();
  }

  async function deleteProblem(problemId: string) {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await deleteDoc(doc(db, "problems", problemId));
      await loadProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  }

  async function markAsReviewed(problemId: string, currentReviewCount: number) {
    try {
      const updates = getNextReviewUpdate(currentReviewCount);
      await updateDoc(doc(db, "problems", problemId), updates);
      await loadProblems();
    } catch (error) {
      console.error("Error marking as reviewed:", error);
    }
  }

  useEffect(() => {
    if (userId) {
      loadProblems();
    }
  }, [userId]);

  return { problems, loading, addProblem, deleteProblem, markAsReviewed };
}
