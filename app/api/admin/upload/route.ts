import { NextRequest, NextResponse } from "next/server";

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

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  const filename = `tours/${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  const res = await fetch(`https://blob.vercel-storage.com/${filename}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${blobToken}`,
      "Content-Type": file.type,
      "x-content-type": file.type,
    },
    body: arrayBuffer,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ url: data.url });
}
