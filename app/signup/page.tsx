import Link from "next/link";
import { MascotLottie } from "@/app/components/mascot-lottie";
import SignupForm from "@/app/signup/signup-form";

export const metadata = {
  title: "Sage | Sign up",
};

export default function SignupPage() {
  return (
    <main
      className="min-h-screen text-slate-900 flex items-center justify-center px-4"
      style={{ backgroundImage: "var(--gradient-login)" }}
    >
      <div className="fixed top-4 right-4 z-30">
        <Link
          href="/login"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-(--accent) hover:text-(--accent)"
        >
          Log in
        </Link>
      </div>

      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-sky-900/20 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Sage</p>
              <h2 className="text-4xl font-semibold leading-tight text-slate-900">Start your streak.</h2>
              <p className="text-base text-slate-600">Create your profile, unlock XP, and dive into adaptive drills.</p>
            </div>

            <MascotLottie />
          </div>

          <div className="flex-1 space-y-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </main>
  );
}
