import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const expected = process.env.ADMIN_TOKEN ?? "bond-admin-2025";
  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find all BLOB-related env vars (names only, not values)
  const blobKeys = Object.keys(process.env).filter((k) => k.includes("BLOB"));
  const resendKeys = Object.keys(process.env).filter((k) => k.includes("RESEND"));

  return NextResponse.json({
    blobKeys,
    resendKeys,
    BLOB_READ_WRITE_TOKEN_set: !!process.env.BLOB_READ_WRITE_TOKEN,
    BLOB_READ_WRITE_TOKEN_prefix: process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 30) ?? null,
  });
}
