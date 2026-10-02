import { sendRegistrationConfirmationEmail } from "@/lib/mail-service";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 },
    );
  }

  const result = await sendRegistrationConfirmationEmail({ name, email });

  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
