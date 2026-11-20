import { getReviews, getSettings } from "@/lib/db";
import ReviewManager from "@/components/admin/ReviewManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const [reviews, settings] = await Promise.all([getReviews(), getSettings()]);
  return <ReviewManager initial={reviews} initialSettings={settings} />;
}
