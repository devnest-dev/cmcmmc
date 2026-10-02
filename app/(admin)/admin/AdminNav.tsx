"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/competition", label: "Competition" },
  { href: "/admin/evaluations", label: "Evaluations" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              isActive
                ? "bg-[#1a2e5a] text-white shadow-sm"
                : "text-slate-600 hover:text-[#1a2e5a]",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
