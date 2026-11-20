import { cookies } from "next/headers";

/** True when the request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get("admin_token")?.value;
  const expected = process.env.ADMIN_TOKEN || "bond-admin-2025";
  return token === expected;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
