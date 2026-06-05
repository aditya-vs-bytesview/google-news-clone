import { Suspense } from 'react';
import Controls from '@/components/Controls';
import BreakingTicker from '@/components/BreakingTicker';
import NewsFeed, { FeedSkeleton } from '@/components/NewsFeed';

export const revalidate = 60;

export default function HomePage({
  searchParams,
}: {
  searchParams: { country?: string; page?: string };
}) {
  const country = searchParams.country ?? '';
  const page = searchParams.page;

  return (
    <main>
      <BreakingTicker country={country} />
      <Controls activeCategory="top" country={country} />
      <h1 className="page-title">Top headlines</h1>
      <Suspense key={`home-${country}-${page ?? ''}`} fallback={<FeedSkeleton />}>
        <NewsFeed category="top" country={country} page={page} basePath="/" />
      </Suspense>
    </main>
  );
}
