"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    // TODO: hook up real auth API
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm text-slate-700" htmlFor="email">
          Email or username
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-label="Email or username"
          autoComplete="username"
          aria-required="true"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          placeholder="you@example.com"
        />
        <div className="flex items-center justify-between">
          <label className="block text-sm text-slate-700" htmlFor="password">
            Password
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-(--accent) hover:text-(--accent-2)"
            aria-label="Forgot password"
          >
            Forgot?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            aria-label="Password"
            aria-required="true"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-(--muted) hover:text-(--foreground)"
          >
            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-linear-to-r from-blue-500 to-sky-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:from-blue-400 hover:to-sky-400 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Resume Learning"}
      </button>

      <div className="text-center text-xs uppercase tracking-[0.35em] text-slate-400">or</div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          aria-label="Continue with Google"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-(--accent)"
        >
          <i className="fa-brands fa-google text-lg" aria-hidden="true" />
          Continue with Google
        </button>
      </div>

      <p className="text-center text-sm text-(--muted)">
        New to Sage?{" "}
        <Link href="/signup" className="font-semibold text-(--accent) hover:text-(--accent-2)">
          Create an account
        </Link>
      </p>
    </form>
  );
}
