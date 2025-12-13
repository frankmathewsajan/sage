import { useMemo } from "react";
import type { Problem } from "../types";
import { 
  generateCalendarData, 
  generateWeeks, 
  groupProblemsByPattern, 
  getProblemsNeedingReview 
} from "../utils/calendarUtils";

/**
 * Custom hook for deriving all practice statistics and data
 * Memoized for performance - only recalculates when problems change
 */
export function usePracticeStats(problems: Problem[]) {
  return useMemo(() => {
    const calendarData = generateCalendarData(problems);
    const weeks = generateWeeks(calendarData);
    const needsReview = getProblemsNeedingReview(problems);
    const problemsByPattern = groupProblemsByPattern(problems);
    
    const today = new Date().toISOString().split("T")[0];
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
    
    const totalProblems = problems.filter((p) => p.solvedDate >= yearStart).length;
    const solvedToday = problems.filter((p) => p.solvedDate === today).length;
    const activeDays = Object.keys(calendarData).length;

    return {
      calendarData,
      weeks,
      needsReview,
      problemsByPattern,
      stats: {
        totalProblems,
        solvedToday,
        activeDays,
      },
    };
  }, [problems]);
}
