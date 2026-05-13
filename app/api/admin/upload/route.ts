import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const expected = process.env.ADMIN_TOKEN ?? "bond-admin-2025";
  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const filename = `tours/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
