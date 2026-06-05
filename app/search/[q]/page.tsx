import { Suspense } from 'react';
import Controls from '@/components/Controls';
import NewsFeed, { FeedSkeleton } from '@/components/NewsFeed';

export const revalidate = 60;

export default function SearchPage({
  params,
  searchParams,
}: {
  params: { q: string };
  searchParams: { country?: string; page?: string };
}) {
  const q = decodeURIComponent(params.q);
  const country = searchParams.country ?? '';

  return (
    <main>
      <Controls activeCategory="" country={country} initialQuery={q} />
      <h1 className="page-title">
        Results for &ldquo;{q}&rdquo;
      </h1>
      <Suspense key={`${q}-${country}-${searchParams.page ?? ''}`} fallback={<FeedSkeleton />}>
        <NewsFeed
          q={q}
          country={country}
          page={searchParams.page}
          basePath={`/search/${encodeURIComponent(q)}`}
        />
      </Suspense>
    </main>
  );
}
