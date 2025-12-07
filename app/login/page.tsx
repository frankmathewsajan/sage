import Link from "next/link";
import { MascotLottie } from "@/app/components/mascot-lottie";
import LoginForm from "@/app/login/login-form";

export const metadata = {
  title: "Sage | Log in",
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen text-slate-900 flex items-center justify-center px-4"
      style={{ backgroundImage: "var(--gradient-login)" }}
    >
      <div className="fixed top-4 right-4 z-30">
        <Link
          href="/signup"
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-(--accent) hover:text-(--accent)"
        >
          Sign up
        </Link>
      </div>

      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-sky-900/20 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Sage</p>
              <h2 className="text-4xl font-semibold leading-tight text-slate-900">Welcome back.</h2>
              <p className="text-base text-slate-600">Pick up where you left off—keep your streak alive and keep learning.</p>
            </div>

            <MascotLottie />
          </div>

          <div className="flex-1">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
