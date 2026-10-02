import "server-only";

import { randomUUID } from "crypto";
import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUER = "https://accounts.google.com";

const STATE_TTL_SECONDS = 10 * 60;

function getStateSecretKey() {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET;

  if (!secret) {
    throw new Error("GOOGLE_OAUTH_STATE_SECRET is not set.");
  }

  return new TextEncoder().encode(secret);
}

function getRedirectUri() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  return `${baseUrl}/api/auth/google/callback`;
}

export function generateNonce() {
  return randomUUID();
}

export type OAuthState = { entryId: string; nonce: string };

/**
 * The `state` param IS the CSRF guard: its HMAC signature proves we issued it,
 * so no separate state cookie is needed. `entryId`/`nonce` ride along in the
 * signed payload instead of separate cookies, which avoids relying on cookies
 * surviving a cross-site redirect round-trip through Google.
 */
export async function signState(payload: OAuthState): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${STATE_TTL_SECONDS}s`)
    .sign(getStateSecretKey());
}

export async function verifyState(state: string): Promise<OAuthState | null> {
  try {
    const { payload } = await jwtVerify(state, getStateSecretKey());

    if (typeof payload.entryId !== "string" || typeof payload.nonce !== "string") {
      return null;
    }

    return { entryId: payload.entryId, nonce: payload.nonce };
  } catch {
    return null;
  }
}

export function buildGoogleAuthUrl({ state, nonce }: { state: string; nonce: string }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not set.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "openid email",
    state,
    nonce,
    prompt: "select_account",
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<{ idToken: string }> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth client credentials are not configured.");
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange authorization code: ${await response.text()}`);
  }

  const data = (await response.json()) as { id_token?: string };

  if (!data.id_token) {
    throw new Error("Google token response did not include an id_token.");
  }

  return { idToken: data.id_token };
}

const googleJwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));

/**
 * Verifies the ID token's signature/issuer/audience, and that its `nonce`
 * claim matches the one we embedded in `state` (blocks token replay). Also
 * requires `email_verified` -- Google's own confirmation that the email
 * claim is trustworthy.
 */
export async function verifyGoogleIdToken(
  idToken: string,
  expectedNonce: string,
): Promise<{ email: string } | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not set.");
  }

  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: GOOGLE_ISSUER,
      audience: clientId,
    });

    if (payload.nonce !== expectedNonce) {
      return null;
    }

    if (payload.email_verified !== true || typeof payload.email !== "string") {
      return null;
    }

    return { email: payload.email };
  } catch {
    return null;
  }
}
