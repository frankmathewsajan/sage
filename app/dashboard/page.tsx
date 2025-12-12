"use client";

import Link from "next/link";
import { supabaseBrowser } from "@/app/lib/supabase-browser";
import { useAuth } from "@/app/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();

  const steps = [
    { title: "Learn the basics", progress: 0 },
    { title: "Learn Important Sorting Techniques", progress: 0 },
    { title: "Solve Problems on Arrays [Easy -> Medium -> Hard]", progress: 0 },
    { title: "Binary Search [1D, 2D Arrays, Search Space]", progress: 0 },
    { title: "Strings [Basic and Medium]", progress: 0 },
    { title: "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]", progress: 0 },
    { title: "Recursion [PatternWise]", progress: 0 },
    { title: "Bit Manipulation [Concepts & Problems]", progress: 0 },
    { title: "Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]", progress: 0 },
    { title: "Sliding Window & Two Pointer Combined Problems", progress: 0 },
    { title: "Heaps [Learning, Medium, Hard Problems]", progress: 0 },
    { title: "Greedy Algorithms [Easy, Medium/Hard]", progress: 0 },
    { title: "Binary Trees [Traversals, Medium and Hard Problems]", progress: 0 },
    { title: "Binary Search Trees [Concept and Problems]", progress: 0 },
    { title: "Graphs [Concepts & Problems]", progress: 0 },
    { title: "Dynamic Programming [Patterns and Problems]", progress: 0 },
    { title: "Tries", progress: 0 },
    { title: "Strings", progress: 0 },
  ];

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    document.cookie = "sage-auth=; Path=/; Max-Age=0; SameSite=Lax";
    window.location.href = "/login";
  }

  return (
    <main
      className="min-h-screen text-slate-900"
      style={{ backgroundImage: "var(--gradient-login)" }}
    >
      <div className="flex min-h-screen flex-row">
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
          <header className="fixed right-0 top-0 left-0 lg:left-64 flex items-center justify-end border-b border-slate-200 bg-white/90 px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800">
                {user?.user_metadata?.name ?? user?.email ?? "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-(--accent) hover:text-(--accent)"
              >
                Sign out
              </button>
            </div>
          </header>

          <section className="flex-1 bg-linear-to-br from-white to-slate-50 px-6 pt-20 lg:pt-24">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Roadmap</p>
                    <h2 className="text-xl font-semibold text-slate-900">Structured Steps</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.title} className="rounded-xl border border-slate-100 bg-white/90 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                        <span>{step.title}</span>
                        <span className="text-(--accent)">{step.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-(--accent) transition-all"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
