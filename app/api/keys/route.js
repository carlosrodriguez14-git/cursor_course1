import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase env vars are missing." },
        { status: 500 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error", error);
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

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/keys failed", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase env vars are missing." },
        { status: 500 }
      );
    }

    const supabase = createSupabaseServerClient();

    const body = await request.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const keyValue = `tvly-${randomBytes(12).toString("hex")}`;

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        name,
        value: keyValue,
        usage: 0,
      })
      .select("id,name,value,usage,created_at")
      .single();

    if (error) {
      console.error("Supabase insert error", error);
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

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/keys failed", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
