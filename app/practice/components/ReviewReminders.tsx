"use client";

import { useEffect, memo } from "react";
import type { Problem } from "../types";
import { Card, Button } from "./shared/UI";

interface ReviewRemindersProps {
  problems: Problem[];
  onMarkReviewed: (problemId: string, reviewCount: number) => void;
}

export const ReviewReminders = memo(function ReviewReminders({ problems, onMarkReviewed }: ReviewRemindersProps) {
  // Request notification permission and show notification for reviews
  useEffect(() => {
    if (problems.length > 0 && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      } else if (Notification.permission === "granted") {
        new Notification("LeetCode Practice Reminder", {
          body: `${problems.length} problem${problems.length !== 1 ? 's' : ''} need${problems.length === 1 ? 's' : ''} review today!`,
          icon: "/favicon.ico",
          tag: "leetcode-review",
          requireInteraction: false,
        });
      }
    }
  }, [problems.length]);

  if (problems.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-4 shadow-sm animate-pulse-subtle">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 animate-bounce-subtle">
          <i className="fa-solid fa-bell text-lg text-white" aria-hidden />
        </div>
        <div className="flex-1">
          <h2 className="mb-1.5 text-lg font-bold text-amber-900">
            {problems.length} Problem{problems.length !== 1 ? 's' : ''} Need Review
          </h2>
          <p className="mb-3 text-sm text-amber-800">
            Time to review these problems to reinforce your understanding through spaced repetition.
          </p>
          <div className="space-y-2">
            {problems.map((problem) => {
              const daysSinceReview = problem.nextReviewDate
                ? Math.floor((new Date().getTime() - new Date(problem.nextReviewDate).getTime()) / (1000 * 60 * 60 * 24))
                : 0;
              const isOverdue = daysSinceReview > 0;
              
              return (
                <div key={problem.id} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-sm border border-amber-100">
                  <div className="flex-1 min-w-0">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline block truncate"
                    >
                      {problem.title}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Review #{problem.reviewCount + 1}
                      {isOverdue && (
                        <span className="text-red-600 font-medium ml-1">• {daysSinceReview} day{daysSinceReview !== 1 ? 's' : ''} overdue</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => onMarkReviewed(problem.id, problem.reviewCount)}
                    className="rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow whitespace-nowrap shrink-0"
                  >
                    Mark Reviewed
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
