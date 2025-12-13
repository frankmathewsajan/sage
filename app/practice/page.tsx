"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PracticeTracker } from "@/app/practice/practice-tracker";

export default function PracticePage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">LeetCode Practice Tracker</h1>
          <p className="mt-2 text-slate-600">
            Track your LeetCode problems and maintain your solving streak
          </p>
        </div>

        <PracticeTracker />
      </div>
    </DashboardShell>
  );
}
