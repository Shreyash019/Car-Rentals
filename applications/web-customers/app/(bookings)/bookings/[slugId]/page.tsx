export default async function Page({
  params,
}: {
  params: Promise<{ slugId: string }>;
}) {
  const { slugId } = await params;

  return <div>Bookings (SlugID): {slugId}</div>;
}
