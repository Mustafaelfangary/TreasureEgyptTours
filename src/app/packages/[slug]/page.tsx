import UnifiedPackagePage from '@/components/package/UnifiedPackagePage';
import { prisma } from '@/lib/prisma';

export default function PackageDetail({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const name = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  return (
    <UnifiedPackagePage
      packageSlug={slug}
      packageName={name}
      style="pharaonic"
      showBookingForm
      showItinerary
      showReviews
      showGallery
    />
  );
}

export async function generateStaticParams() {
  const packages = await prisma.package.findMany({ select: { name: true } });
  return packages
    .map((p) => p.name?.trim())
    .filter((n): n is string => Boolean(n && n.length))
    .map((name) => ({ slug: name.toLowerCase().replace(/\s+/g, '-') }));
}
