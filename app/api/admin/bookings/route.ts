import { getBookings } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return Response.json(await getBookings());
}
