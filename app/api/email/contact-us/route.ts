import { sendContactUsEmail } from "@/lib/mail-service";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 },
    );
  }

  const result = await sendContactUsEmail(formData);

  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
