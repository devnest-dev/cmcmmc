"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { isEvaluationLaunched } from "@/lib/evaluation-launch";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

const navGroups: NavGroup[] = [
  {
    label: "About",
    links: [
      { label: "The Congress", href: "/#about" },
      { label: "Speakers", href: "/#speakers" },
      { label: "Program", href: "/2nd-CM-CMMC-Program.pdf", external: true },
    ],
  },
  {
    label: "Participate",
    links: [
      { label: "Vote", href: "/vote" },
      { label: "Live Attendance", href: "/live" },
      { label: "Evaluation", href: "/evaluation" },
    ],
  },
];

const registrationLink: NavLink = { label: "Register", href: "/registration" };

const noopSubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  // Server snapshot is false so prerendered pages don't show the link early.
  const evaluationLaunched = useSyncExternalStore(noopSubscribe, isEvaluationLaunched, () => false);
  const visibleNavGroups = navGroups.map((group) => ({
    ...group,
    links: group.links.filter((link) => link.href !== "/evaluation" || evaluationLaunched),
  }));

  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 flex items-center justify-between h-[15vh]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 max-w-37.5">
          <Image src="/logo.png" alt="CM-CMMC Logo" width={200} height={200} />
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {visibleNavGroups.map((group) => (
            <li key={group.label}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="group flex items-center gap-1 text-xs font-semibold text-black uppercase tracking-wide hover:text-[#0091C0] data-[state=open]:text-[#0091C0] transition-colors outline-none">
                  {group.label}
                  <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={12} className="min-w-48">
                  {group.links.map((link) => (
                    <DropdownMenuItem key={link.label} asChild>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        prefetch={link.external ? false : undefined}
                        className="text-xs font-semibold uppercase tracking-wide cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}

          <li>
            <Link
              href={registrationLink.href}
              className="inline-flex items-center rounded-full bg-[#0091C0] px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wide hover:bg-[#007aa3] transition-colors"
            >
              {registrationLink.label}
            </Link>
          </li>
        </ul>

        {/* Mobile menu (Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-[#1a2e5a]" />
              <span className="block w-6 h-0.5 bg-[#1a2e5a]" />
              <span className="block w-6 h-0.5 bg-[#1a2e5a]" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="md:hidden w-3/4 sm:max-w-sm" showCloseButton={false}>
            <SheetHeader className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="CM-CMMC Logo" width={150} height={150} />
              </Link>
            </SheetHeader>

            <nav className="flex flex-col gap-6 p-4">
              {visibleNavGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                    {group.label}
                  </p>
                  {group.links.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        prefetch={link.external ? false : undefined}
                        className="text-sm font-semibold text-black uppercase tracking-wide hover:text-[#0091C0] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ))}

              <SheetClose asChild>
                <Link
                  href={registrationLink.href}
                  className="inline-flex justify-center rounded-full bg-[#0091C0] px-5 py-3 text-sm font-semibold text-white uppercase tracking-wide hover:bg-[#007aa3] transition-colors"
                >
                  {registrationLink.label}
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
