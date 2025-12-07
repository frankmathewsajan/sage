"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    // TODO: connect to real signup endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-slate-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          aria-label="Full name"
          aria-required="true"
          autoComplete="name"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          placeholder="Ada Lovelace"
        />
        <label className="text-sm text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-label="Email"
          aria-required="true"
          autoComplete="email"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
          placeholder="you@example.com"
        />
        <label className="text-sm text-slate-700" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            aria-label="Password"
            aria-required="true"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-slate-500 hover:text-slate-700"
          >
            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
          </button>
        </div>
        <label className="text-sm text-slate-700" htmlFor="confirm">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirm"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            required
            aria-label="Confirm password"
            aria-required="true"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-slate-500 hover:text-slate-700"
          >
            <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-linear-to-r from-blue-500 to-sky-500 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:from-blue-400 hover:to-sky-400 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Start My Streak"}
      </button>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          aria-label="Continue with Google"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-(--accent)"
        >
          <i className="fa-brands fa-google text-lg" aria-hidden="true" />
          Continue with Google
        </button>
      </div>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-(--accent) hover:text-(--accent-2)">
          Log in
        </Link>
      </p>
    </form>
  );
}
