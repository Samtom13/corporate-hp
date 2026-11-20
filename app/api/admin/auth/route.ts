import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  // `||` not `??`: an empty ADMIN_TOKEN must never make an empty password valid
  const expected = process.env.ADMIN_TOKEN || "bond-admin-2025";

  if (typeof password !== "string" || password.length === 0 || password !== expected) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
