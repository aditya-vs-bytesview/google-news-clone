import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Controls from '@/components/Controls';
import BreakingTicker from '@/components/BreakingTicker';
import NewsFeed, { FeedSkeleton } from '@/components/NewsFeed';
import { CATEGORIES, CATEGORY_SLUGS } from '@/lib/constants';

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== 'top').map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { country?: string; page?: string };
}) {
  const slug = params.slug.toLowerCase();
  if (!CATEGORY_SLUGS.has(slug)) notFound();

  const country = searchParams.country ?? '';
  const label = CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <main>
      <BreakingTicker country={country} />
      <Controls activeCategory={slug} country={country} />
      <h1 className="page-title">{label}</h1>
      <Suspense key={`${slug}-${country}-${searchParams.page ?? ''}`} fallback={<FeedSkeleton />}>
        <NewsFeed
          category={slug}
          country={country}
          page={searchParams.page}
          basePath={`/category/${slug}`}
        />
      </Suspense>
    </main>
  );
}
