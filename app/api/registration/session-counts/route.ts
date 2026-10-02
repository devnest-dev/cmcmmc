import { NextResponse } from "next/server";

import { getBreakoutSessionCounts } from "@/lib/submissions.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await getBreakoutSessionCounts();

    return NextResponse.json(
      { ok: true, ...counts },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load session counts.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
