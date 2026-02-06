import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase env vars are missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const key = body?.key?.trim();

    if (!key) {
      return NextResponse.json(
        { valid: false, error: "API key is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("id")
      .eq("value", key)
      .limit(1);

    if (error) {
      console.error("Supabase validate error", error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ valid: Array.isArray(data) && data.length > 0 });
  } catch (error) {
    console.error("POST /api/keys/validate failed", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
