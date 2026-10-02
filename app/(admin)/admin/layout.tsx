import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth/session";
import AdminNav from "./AdminNav";

import { logoutAction } from "@/lib/auth/actions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">CM-CMMC admin</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <AdminNav />
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Signed in
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/">Public site</Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="default">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}