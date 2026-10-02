import { NextResponse } from "next/server";

import { listPublicCompetitionEntries } from "@/lib/competition.server";

export async function GET() {
  const entries = await listPublicCompetitionEntries();

  // Results are the same for every visitor, so let the CDN absorb repeat requests.
  return NextResponse.json(
    { ok: true, entries },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" } },
  );
}
