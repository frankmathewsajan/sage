"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-browser";

export function DashboardShell({ children, pageTitle }: { children: React.ReactNode; pageTitle?: string }) {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  async function handleSignOut() {
    await signOut(firebaseAuth);
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
        <aside className={`hidden border-r border-slate-200 bg-white/90 py-8 shadow-sm lg:block transition-all duration-300 fixed top-0 left-0 h-screen z-20 ${isMinimized ? 'w-20' : 'w-64'}`}>
          <div className="mb-8 flex items-center justify-between px-5">
            {!isMinimized && <div className="pl-3" />}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              <i className={`fa-solid ${isMinimized ? 'fa-angles-right' : 'fa-angles-left'}`} aria-hidden />
            </button>
          </div>
          <nav className="space-y-2 px-3 text-sm font-semibold text-slate-700">
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/"
              title="Learn"
            >
              <i className="fa-solid fa-graduation-cap text-emerald-500" aria-hidden />
              {!isMinimized && <span>Learn</span>}
            </Link>
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/practice"
              title="Practice"
            >
              <i className="fa-solid fa-dumbbell text-blue-500" aria-hidden />
              {!isMinimized && <span>Practice</span>}
            </Link>
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/leaderboards"
              title="Leaderboards"
            >
              <i className="fa-solid fa-trophy text-amber-500" aria-hidden />
              {!isMinimized && <span>Leaderboards</span>}
            </Link>
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/quests"
              title="Quests"
            >
              <i className="fa-solid fa-star text-pink-500" aria-hidden />
              {!isMinimized && <span>Quests</span>}
            </Link>
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/shop"
              title="Shop"
            >
              <i className="fa-solid fa-cart-shopping text-sky-500" aria-hidden />
              {!isMinimized && <span>Shop</span>}
            </Link>
            <Link 
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100" 
              href="/profile"
              title="Profile"
            >
              <i className="fa-solid fa-user text-purple-500" aria-hidden />
              {!isMinimized && <span>Profile</span>}
            </Link>
          </nav>
        </aside>

        <div className="relative flex flex-1 flex-col">
          {/* Header */}
          <header className={`fixed right-0 top-0 left-0 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm z-30 transition-all duration-300 ${isMinimized ? 'lg:left-20' : 'lg:left-64'}`}>
            {pageTitle && (
              <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
            )}
            {!pageTitle && <div />}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800">
                {user?.displayName ?? user?.email ?? "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-(--accent) hover:text-(--accent)"
              >
                Sign out
              </button>
            </div>
          </header>

          {/* Main Content */}
          <section className={`flex-1 bg-linear-to-br from-white to-slate-50 px-4 sm:px-6 pt-20 lg:pt-24 pb-12 transition-all duration-300 overflow-x-hidden ${isMinimized ? 'lg:ml-20' : 'lg:ml-64'}`}>
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}