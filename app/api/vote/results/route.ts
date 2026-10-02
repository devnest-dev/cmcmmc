import { NextResponse } from "next/server";

import { listPublicCompetitionEntries } from "@/lib/competition.server";

export async function GET() {
  const entries = await listPublicCompetitionEntries();
  return NextResponse.json({ ok: true, entries });
}
