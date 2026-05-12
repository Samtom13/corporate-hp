import { notFound } from "next/navigation";
import { getTourById } from "@/lib/db";
import ListingEditor from "@/components/admin/ListingEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) notFound();
  return <ListingEditor initial={tour} />;
}
