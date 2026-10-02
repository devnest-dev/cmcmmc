import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionRole } from "@/lib/auth/session";

import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access the CM-CMMC staff or admin tools.",
};

export default async function LoginPage() {
  const role = await getSessionRole();

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "staff") {
    redirect("/attendance");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff,#eef4ff_50%,#dfe9f6_100%)] px-4 py-16">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] md:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-between gap-8 bg-[#1a2e5a] px-8 py-10 text-white md:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7fd9de]">
                Staff &amp; admin access
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                CM-CMMC event tools
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Staff sign in for the check-in scanner. Admins sign in for the
                full submission dashboard and everything staff can do.
              </p>
            </div>
          </section>

          <section className="px-8 py-10 md:px-10">
            <div className="max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">
                Login
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1a2e5a]">
                Sign in to continue
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Use your staff or admin credentials to continue.
              </p>

              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
