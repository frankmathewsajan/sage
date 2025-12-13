"use client";

import { useEffect, memo } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { usePracticeStore } from "./store/usePracticeStore";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { CalendarHeatmap } from "./components/CalendarHeatmap";
import { ReviewReminders } from "./components/ReviewReminders";
import { PatternBaskets } from "./components/PatternBaskets";
import { AddProblemForm } from "./components/AddProblemForm";
import { ProblemsList } from "./components/ProblemsList";
import { Button } from "./components/shared/UI";

export const PracticeTracker = memo(function PracticeTracker() {
  const { user } = useAuth();
  const { 
    problems, 
    loading, 
    showForm, 
    setShowForm, 
    loadProblems, 
    addProblem, 
    deleteProblem, 
    markAsReviewed 
  } = usePracticeStore();

  // Load problems when user is available
  useEffect(() => {
    if (user?.uid) {
      loadProblems(user.uid);
    }
  }, [user?.uid, loadProblems]);

  // Calculate all derived data with memoization
  const { weeks, needsReview, problemsByPattern, stats } = usePracticeStats(problems);

  return (
    <div className="space-y-4 w-full">
      {/* Add Problem Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          icon="fa-solid fa-plus"
          onClick={() => setShowForm(true)}
        >
          Add Problem
        </Button>
      </div>

      <CalendarHeatmap
        weeks={weeks}
        totalProblems={stats.totalProblems}
        solvedToday={stats.solvedToday}
        activeDays={stats.activeDays}
      />

      <ReviewReminders 
        problems={needsReview} 
        onMarkReviewed={(problemId, reviewCount) => markAsReviewed(user!.uid, problemId, reviewCount)} 
      />

      <PatternBaskets problemsByPattern={problemsByPattern} />

      {showForm && (
        <AddProblemForm 
          onSubmit={(data) => addProblem(user!.uid, data)} 
          onClose={() => setShowForm(false)} 
        />
      )}

      <ProblemsList 
        problems={problems} 
        loading={loading} 
        onDelete={(problemId) => deleteProblem(user!.uid, problemId)} 
      />
    </div>
  );
});
