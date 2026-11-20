import { getFaqs } from "@/lib/db";
import FaqManager from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  return <FaqManager initial={await getFaqs()} />;
}
