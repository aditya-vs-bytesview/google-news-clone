// Server-only NewsData.io client. Never import this into a 'use client' file.
// Docs: https://newsdata.io/documentation

const BASE_URL = 'https://newsdata.io/api/1';

export type Article = {
  article_id: string;
  title: string | null;
  link: string;
  description: string | null;
  pubDate: string | null;
  image_url: string | null;
  source_id: string | null;
  category?: string[];
  country?: string[];
};

export type FetchParams = {
  q?: string;
  category?: string;
  country?: string;
  language?: string;
  page?: string;
};

export type NewsResult = {
  articles: Article[];
  nextPage: string | null;
  totalResults: number;
  error?: string;
};

export function getApiKey(): string | null {
  const key = process.env.NEWSDATA_API_KEY;
  return key && key.trim() ? key.trim() : null;
}

function explainError(status: number): string {
  switch (status) {
    case 401:
      return 'Invalid API key (401). Check NEWSDATA_API_KEY in your .env.local file.';
    case 403:
      return 'This request requires a paid NewsData.io plan (403). It was skipped — the free feed still works.';
    case 422:
      return 'NewsData.io could not process this query (422). It may rely on a paid-only parameter.';
    case 429:
      return 'Rate limit reached (429). The free tier is limited — wait a moment and try again.';
    default:
      return `NewsData.io request failed (HTTP ${status}).`;
  }
}

export async function fetchNews(params: FetchParams = {}): Promise<NewsResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      articles: [],
      nextPage: null,
      totalResults: 0,
      error:
        'NEWSDATA_API_KEY is not set. Copy .env.example to .env.local and add a free key from https://newsdata.io.',
    };
  }

  const url = new URL(`${BASE_URL}/latest`);
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('language', params.language ?? 'en');
  if (params.q) url.searchParams.set('q', params.q);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.country) url.searchParams.set('country', params.country);
  if (params.page) url.searchParams.set('page', params.page);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!res.ok) {
      return { articles: [], nextPage: null, totalResults: 0, error: explainError(res.status) };
    }

    const data = await res.json();

    if (data?.status !== 'success') {
      const message =
        (data && data.results && (data.results.message || data.message)) ||
        'NewsData.io returned an error response.';
      return { articles: [], nextPage: null, totalResults: 0, error: String(message) };
    }

    return {
      articles: Array.isArray(data.results) ? (data.results as Article[]) : [],
      nextPage: data.nextPage ?? null,
      totalResults: typeof data.totalResults === 'number' ? data.totalResults : 0,
    };
  } catch {
    return {
      articles: [],
      nextPage: null,
      totalResults: 0,
      error: 'Network error reaching NewsData.io. Check your connection and try again.',
    };
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Deterministic (UTC) formatting to avoid server/client hydration drift.
export function formatDate(input: string | null): string {
  if (!input) return '';
  const normalized = input.includes('T') ? input : input.replace(' ', 'T') + 'Z';
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return input;
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hh}:${mm} UTC`;
}
