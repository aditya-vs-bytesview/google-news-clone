import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/newsdata';

// Always fresh — the ticker polls this every 60 seconds.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || undefined;

  const result = await fetchNews({ category: 'top', country });

  const headlines = result.articles
    .filter((a) => a.title)
    .slice(0, 12)
    .map((a) => ({ id: a.article_id, title: a.title as string, link: a.link }));

  return NextResponse.json({ headlines, error: result.error ?? null });
}
