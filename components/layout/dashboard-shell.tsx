"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { supabaseBrowser } from "@/app/lib/supabase-browser";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

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
           {children}
          </section>
        </div>
      </div>
    </main>
  );
}