import Image from 'next/image';
import Link from 'next/link';
import { fetchNews, formatDate, type Article } from '@/lib/newsdata';

type NewsFeedProps = {
  q?: string;
  category?: string;
  country?: string;
  page?: string;
  basePath: string;
};

export function FeedSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card card-skeleton" aria-hidden="true" />
      ))}
    </div>
  );
}

function NewsCard({ article }: { article: Article }) {
  return (
    <article className="card">
      <a href={article.link} target="_blank" rel="noreferrer" className="card-link">
        <div className="card-media">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title ?? 'News thumbnail'}
              fill
              sizes="(max-width: 700px) 100vw, 360px"
              className="card-img"
            />
          ) : (
            <div className="card-img placeholder">
              <span>{article.source_id ?? 'news'}</span>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className="source">{article.source_id ?? 'unknown'}</span>
            <span className="dot">·</span>
            <span>{formatDate(article.pubDate)}</span>
          </div>
          <h3 className="card-title">{article.title ?? 'Untitled'}</h3>
          {article.description ? <p className="card-desc">{article.description}</p> : null}
        </div>
      </a>
    </article>
  );
}

export default async function NewsFeed({ q, category, country, page, basePath }: NewsFeedProps) {
  const result = await fetchNews({ q, category, country, page });

  if (result.error) {
    return (
      <div className="notice notice-error">
        <strong>Could not load news.</strong>
        <p>{result.error}</p>
      </div>
    );
  }

  if (result.articles.length === 0) {
    return (
      <div className="notice">
        <strong>No articles found.</strong>
        <p>Try a different keyword, category or country.</p>
      </div>
    );
  }

  const params = new URLSearchParams();
  if (country) params.set('country', country);
  if (result.nextPage) params.set('page', result.nextPage);
  const moreHref = `${basePath}?${params.toString()}`;

  return (
    <>
      <div className="grid">
        {result.articles.map((a) => (
          <NewsCard key={a.article_id ?? a.link} article={a} />
        ))}
      </div>
      {result.nextPage ? (
        <div className="more">
          <Link href={moreHref} className="more-btn">
            More headlines →
          </Link>
        </div>
      ) : null}
    </>
  );
}
