import type { Metadata } from "next";
import { siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Data Privacy",
  description:
    "Learn how we handle data privacy for the Cebu Metropolitan Catholic Mass Media Congress.",
  alternates: {
    canonical: "/data-privacy",
  },
};

export default function DataPrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold text-[#1a2e5a] mb-4">Data Privacy</h1>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        This page will outline how {siteName} collects, uses, and protects
        personal information. We will publish the full privacy notice and
        contact details before registration opens.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        For questions in the meantime, please contact
        thearchdioceseofcebu@gmail.com.
      </p>
    </main>
  );
}
