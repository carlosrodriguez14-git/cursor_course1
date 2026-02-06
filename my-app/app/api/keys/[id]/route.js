import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase env vars are missing." },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const keyId = resolvedParams?.id;

    if (!keyId || keyId === "undefined") {
      return NextResponse.json(
        { error: "Missing key id." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const body = await request.json();
    const updates = {};

    if (typeof body?.name === "string" && body.name.trim()) {
      updates.name = body.name.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("api_keys")
      .update(updates)
      .eq("id", keyId)
      .select("id,name,value,usage,created_at")
      .single();

    if (error) {
      console.error("Supabase update error", error);
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
    console.error("PATCH /api/keys/:id failed", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase env vars are missing." },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const keyId = resolvedParams?.id;

    if (!keyId || keyId === "undefined") {
      return NextResponse.json(
        { error: "Missing key id." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", keyId);

    if (error) {
      console.error("Supabase delete error", error);
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/keys/:id failed", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
