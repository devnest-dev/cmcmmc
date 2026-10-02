"use server";

import { redirect } from "next/navigation";

import { clearSession, resolveCredentialRole, setSession } from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _state: LoginState | undefined,
  formData: FormData,
): Promise<LoginState | undefined> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const role = resolveCredentialRole(username, password);

  if (!role) {
    return {
      error: "Invalid username or password.",
    };
  }

  await setSession(role);
  redirect(role === "admin" ? "/admin" : "/attendance");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
