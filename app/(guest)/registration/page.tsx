import type { Metadata } from "next";
import RegistrationForm from "./RegistrationForm";
import { isRegistrationOpen } from "@/lib/registration-status";

// Prevent Next.js from statically prerendering this page at build time —
// the open/closed check must be re-evaluated on every request, not baked
// in once and cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Registration details and updates for the Cebu Metropolitan Catholic Mass Media Congress.",
  alternates: {
    canonical: "/registration",
  },
};

export default function RegistrationPage() {
  if (!isRegistrationOpen()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-[#1a2e5a]">
          Registration is now closed.
        </h1>
      </main>
    );
  }

  return (
    <main>
      <RegistrationForm />
    </main>
  );
}
