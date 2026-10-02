import { NextResponse } from "next/server";

import { getArchdioceseAttendanceCounts } from "@/lib/attendance/dashboard.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await getArchdioceseAttendanceCounts();

    // Lets a CDN absorb polling from many /live viewers; matches the server-side cache window.
    return NextResponse.json(
      { ok: true, ...counts },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load attendance counts.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
