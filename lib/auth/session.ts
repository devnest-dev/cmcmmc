import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionRole = "staff" | "admin";

export const SESSION_COOKIE = "cmcmmc-session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const STAFF_USERNAME = process.env.STAFF_USERNAME;
const STAFF_PASSWORD = process.env.STAFF_PASSWORD;

export async function getSessionRole(): Promise<SessionRole | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  return value === "admin" || value === "staff" ? value : null;
}

export async function isStaffSessionActive() {
  return (await getSessionRole()) !== null;
}

export async function isAdminSessionActive() {
  return (await getSessionRole()) === "admin";
}

export async function requireStaffSession() {
  if (!(await isStaffSessionActive())) {
    redirect("/login");
  }
}

export async function requireAdminSession() {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }
}

export function resolveCredentialRole(
  username: string,
  password: string,
): SessionRole | null {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return "admin";
  }
  if (username === STAFF_USERNAME && password === STAFF_PASSWORD) {
    return "staff";
  }
  return null;
}

export async function setSession(role: SessionRole) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
