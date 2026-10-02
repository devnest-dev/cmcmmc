import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { parishOptions } from "@/lib/registration-options";

export type ArchdioceseAttendanceCounts = {
  dayOne: Record<string, number>;
  dayTwo: Record<string, number>;
};

// Every /live viewer shares one cached result, so the DB is queried at most once per window.
const COUNTS_REVALIDATE_SECONDS = 5;

function buildInitialCounts(): Record<string, number> {
  return Object.fromEntries(parishOptions.map((option) => [option, 0]));
}

function resolveArchdioceseKey(archdiocese: string | null | undefined): string {
  if (archdiocese && parishOptions.includes(archdiocese)) {
    return archdiocese;
  }
  return "Others";
}

async function fetchArchdioceseAttendanceCounts(): Promise<ArchdioceseAttendanceCounts> {
  const dayOne = buildInitialCounts();
  const dayTwo = buildInitialCounts();

  // Cookie-less client: cookies() is not allowed inside a cache scope, and this data is public.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase
    .from("submissions")
    .select("archdiocese, day_one_attendance, day_two_attendance");

  if (error) {
    throw new Error(error.message);
  }

  (data ?? []).forEach((row) => {
    const record = row as {
      archdiocese?: string | null;
      day_one_attendance?: string | null;
      day_two_attendance?: string | null;
    };

    const key = resolveArchdioceseKey(record.archdiocese);

    if (record.day_one_attendance) {
      dayOne[key] += 1;
    }
    if (record.day_two_attendance) {
      dayTwo[key] += 1;
    }
  });

  return { dayOne, dayTwo };
}

export const getArchdioceseAttendanceCounts = unstable_cache(
  fetchArchdioceseAttendanceCounts,
  ["attendance-dashboard-counts"],
  { revalidate: COUNTS_REVALIDATE_SECONDS },
);
