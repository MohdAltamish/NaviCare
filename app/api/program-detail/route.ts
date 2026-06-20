import { NextRequest, NextResponse } from "next/server";
import { getProgramBySlug } from "@/lib/programs-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing program slug." },
      { status: 400 }
    );
  }

  const program = getProgramBySlug(slug);

  if (!program) {
    return NextResponse.json(
      { error: `Program "${slug}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(program);
}
