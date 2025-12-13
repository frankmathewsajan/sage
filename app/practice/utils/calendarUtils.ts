import type { Problem, CalendarDay } from "../types";

export function generateCalendarData(problems: Problem[]): Record<string, number> {
  const calendar: Record<string, number> = {};
  problems.forEach((problem) => {
    calendar[problem.solvedDate] = (calendar[problem.solvedDate] || 0) + 1;
  });
  return calendar;
}

export function generateWeeks(calendarData: Record<string, number>): CalendarDay[][] {
  const today = new Date();
  const weeks: CalendarDay[][] = [];
  
  for (let week = 51; week >= 0; week--) {
    const weekDays: CalendarDay[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const dateStr = date.toISOString().split("T")[0];
      weekDays.push({ date: dateStr, count: calendarData[dateStr] || 0 });
    }
    weeks.push(weekDays);
  }
  
  return weeks;
}

export function groupProblemsByPattern(problems: Problem[]): Record<string, Problem[]> {
  const groups: Record<string, Problem[]> = {};
  problems.forEach((problem) => {
    if (problem.pattern && !problem.neuralPathwayCreated) {
      if (!groups[problem.pattern]) {
        groups[problem.pattern] = [];
      }
      groups[problem.pattern].push(problem);
    }
  });
  return groups;
}

export function getProblemsNeedingReview(problems: Problem[]): Problem[] {
  const today = new Date().toISOString().split("T")[0];
  return problems.filter(
    (p) => !p.neuralPathwayCreated && p.nextReviewDate && p.nextReviewDate <= today
  );
}
