"use client";

import Link from "next/link";
import { supabaseBrowser } from "@/app/lib/supabase-browser";
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

  const steps = [
    { title: "Phase 1: The Basics (The Language of Efficiency)", progress: 0, isPhase: true },
    { title: "Big O Notation (Time & Space Complexity)", progress: 0, isPhase: false },
    { title: "Memory Management (Stack vs. Heap, Reference vs. Value)", progress: 0, isPhase: false },
    { title: "Basic Arrays & Strings (Under the hood)", progress: 0, isPhase: false },
    { title: "Phase 2: Linear Data Structures (The Toolbox)", progress: 0, isPhase: true },
    { title: "Hash Maps (Collision handling, internal logic)", progress: 0, isPhase: false },
    { title: "Two Pointers & Sliding Window", progress: 0, isPhase: false },
    { title: "Linked Lists", progress: 0, isPhase: false },
    { title: "Stacks & Queues", progress: 0, isPhase: false },
    { title: "Phase 3: Non-Linear Data Structures (The Major League)", progress: 0, isPhase: true },
    { title: "Recursion & Backtracking", progress: 0, isPhase: false },
    { title: "Trees (Binary, BST, Heaps)", progress: 0, isPhase: false },
    { title: "Graphs (BFS, DFS, Topo Sort)", progress: 0, isPhase: false },
    { title: "Phase 4: Optimization (The Boss Battles)", progress: 0, isPhase: true },
    { title: "Dynamic Programming", progress: 0, isPhase: false },
    { title: "Greedy Algorithms", progress: 0, isPhase: false },
    { title: "Bit Manipulation", progress: 0, isPhase: false },
  ];

  const phases = steps.reduce((acc, step) => {
    if (step.isPhase) {
      acc.push({
        title: step.title,
        items: [],
      });
    } else {
      acc[acc.length - 1].items.push(step);
    }
    return acc;
  }, [] as { title: string; items: typeof steps }[]);

  // Helper to chunk phases into pairs (Rows)
  const rows = [];
  for (let i = 0; i < phases.length; i += 2) {
    rows.push(phases.slice(i, i + 2));
  }

  const phaseColors = [
    "bg-gradient-to-br from-amber-50 via-white to-amber-100",
    "bg-gradient-to-br from-red-50 via-white to-red-100",
    "bg-gradient-to-br from-purple-50 via-white to-purple-100",
    "bg-gradient-to-br from-slate-50 via-white to-slate-100",
  ];

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    document.cookie = "sage-auth=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "isAdmin=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/login";
  }

  return (
    <main
      className="min-h-screen text-slate-900"
      style={{ backgroundImage: "var(--gradient-login)" }}
    >
      <div className="flex min-h-screen flex-row">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/90 px-5 py-8 shadow-sm lg:block">
          <div className="mb-8 pl-3" />
          <nav className="space-y-2 text-sm font-semibold text-slate-700">
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/">
              <i className="fa-solid fa-graduation-cap text-emerald-500" aria-hidden />
              <span>Learn</span>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/practice">
              <i className="fa-solid fa-dumbbell text-blue-500" aria-hidden />
              <span>Practice</span>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/leaderboards">
              <i className="fa-solid fa-trophy text-amber-500" aria-hidden />
              <span>Leaderboards</span>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/quests">
              <i className="fa-solid fa-star text-pink-500" aria-hidden />
              <span>Quests</span>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/shop">
              <i className="fa-solid fa-cart-shopping text-sky-500" aria-hidden />
              <span>Shop</span>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" href="/profile">
              <i className="fa-solid fa-user text-purple-500" aria-hidden />
              <span>Profile</span>
            </Link>
          </nav>
        </aside>

        <div className="relative flex flex-1 flex-col">
          {/* Header */}
          <header className="fixed right-0 top-0 left-0 flex items-center justify-end border-b border-slate-200 bg-white/90 px-6 py-4 shadow-sm lg:left-64 z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800">
                {user?.user_metadata?.name ?? user?.email ?? "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Sign out
              </button>
            </div>
          </header>

          {/* Main Content */}
          <section className="flex-1 bg-gradient-to-br from-white to-slate-50 px-6 pt-20 lg:pt-24 pb-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Roadmap</p>
                <h2 className="text-xl font-semibold text-slate-900">Structured Steps</h2>
              </div>
              {isAdmin && (
                <div className="text-xl">
                  <i className="fa-solid fa-user-shield bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"></i>
                </div>
              )}
            </div>

            {/* NEW SLANTED LAYOUT IMPLEMENTATION */}
            <div className="flex flex-col gap-6">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full filter drop-shadow-md">
                  {row.map((phase, colIndex) => {
                    // Determine if this is the Left or Right card
                    const isLeft = colIndex === 0;

                    // Calculate the original index to fetch the correct color
                    const originalIndex = rowIndex * 2 + colIndex;

                    // Styles based on position (Left vs Right)
                    // Left: Cut Bottom-Right corner, Rounded Left
                    // Right: Cut Top-Left corner, Rounded Right, Negative Margin to pull it left
                    const positionClasses = isLeft
                      ? "rounded-l-2xl z-10 pr-16 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
                      : "rounded-r-2xl z-0 pl-16 -ml-10 [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)]";

                    return (
                      <div
                        key={phase.title}
                        className={`w-1/2 p-8 border border-slate-100 ${positionClasses} ${phaseColors[originalIndex]}`}
                      >
                        <div className="mb-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {phase.title.split(":")[0]}
                          </h3>
                          <p className="text-base font-semibold text-slate-800">{phase.title.split(":")[1]}</p>
                        </div>
                        <div className="space-y-2">
                          {phase.items.map((item) => (
                            <div
                              key={item.title}
                              className={'rounded-lg border border-slate-100 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)]'}
                              // Keeping the item's internal clip-path as originally requested
                              style={{ clipPath: 'polygon(0 0, 95% 0, 100% 25%, 100% 100%, 0 100%)' }}
                            >
                              <div className="p-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                                  <span>{item.title}</span>
                                  <span className="text-[var(--accent)]">{item.progress}%</span>
                                </div>
                                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                                  <div
                                    className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}