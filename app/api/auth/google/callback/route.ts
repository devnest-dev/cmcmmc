import { NextResponse } from "next/server";

import { recordVerifiedVote } from "@/lib/competition-votes.server";
import { exchangeCodeForTokens, verifyGoogleIdToken, verifyState } from "@/lib/google-oauth";

const VOTED_COOKIE = "cmcmmc-voted";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const voteUrl = new URL("/vote", url.origin);

  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    voteUrl.searchParams.set("error", "oauth_cancelled");
    return NextResponse.redirect(voteUrl);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    voteUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(voteUrl);
  }

  const decodedState = await verifyState(state);
  if (!decodedState) {
    voteUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(voteUrl);
  }

  let email: string;
  try {
    const { idToken } = await exchangeCodeForTokens(code);
    const verified = await verifyGoogleIdToken(idToken, decodedState.nonce);

    if (!verified) {
      voteUrl.searchParams.set("error", "invalid_state");
      return NextResponse.redirect(voteUrl);
    }

    email = verified.email;
  } catch (error) {
    console.error("Google OAuth verification failed:", error);
    voteUrl.searchParams.set("error", "google_error");
    return NextResponse.redirect(voteUrl);
  }

  const result = await recordVerifiedVote({ entryId: decodedState.entryId, email });

  if (!result.ok) {
    voteUrl.searchParams.set("error", result.reason);
    return NextResponse.redirect(voteUrl);
  }

  voteUrl.searchParams.set("voted", "1");
  const response = NextResponse.redirect(voteUrl);
  response.cookies.set(VOTED_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
