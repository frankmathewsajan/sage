"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoadmapGrid } from "@/components/dashboard/roadmap-grid";
import { useAuth } from "@/app/providers/auth-provider";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("isAdmin="));
    if (cookie) {
      setIsAdmin(cookie.split("=")[1] === "true");
    }
  }, []);

  return (
    <DashboardShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Roadmap</p>
          <h2 className="text-xl font-semibold text-slate-900">Structured Steps</h2>
        </div>
        {isAdmin && (
          <div className="text-xl">
            <i className="fa-solid fa-user-shield bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"></i>
          </div>
        )}
      </div>
      <RoadmapGrid />
    </DashboardShell>
  );
}