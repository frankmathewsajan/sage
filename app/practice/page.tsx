"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PracticeTracker } from "@/app/practice/practice-tracker";

export default function PracticePage() {
  return (
    <DashboardShell pageTitle="LeetCode Practice Tracker">
      <PracticeTracker />
    </DashboardShell>
  );
}
