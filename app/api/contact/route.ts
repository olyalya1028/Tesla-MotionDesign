import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

// Same rules the form applies in the browser — repeated here because the client
// side check is a convenience, not a guarantee.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = { name: string; email: string; phone: string };

function readPayload(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, email, phone } = body as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof phone !== "string") {
    return null;
  }

  const trimmed = { name: name.trim(), email: email.trim(), phone: phone.trim() };
  const digits = trimmed.phone.replace(/\D/g, "");

  if (trimmed.name.length < 2 || trimmed.name.length > 120) return null;
  if (trimmed.email.length > 254 || !EMAIL_PATTERN.test(trimmed.email)) return null;
  if (digits.length < 8 || digits.length > 15) return null;

  return trimmed;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = readPayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Please check your name, email and phone number." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
    });

    if (error) {
      console.error("contact_submissions insert failed", error);
      return NextResponse.json(
        { error: "We could not save your details. Please try again." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("contact route failed", error);
    return NextResponse.json(
      { error: "We could not save your details. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
