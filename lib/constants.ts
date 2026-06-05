export type Category = { slug: string; label: string };

// NewsData.io free-tier categories used as pill filters.
export const CATEGORIES: Category[] = [
  { slug: 'top', label: 'Top' },
  { slug: 'world', label: 'World' },
  { slug: 'business', label: 'Business' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'science', label: 'Science' },
  { slug: 'health', label: 'Health' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'entertainment', label: 'Entertainment' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'environment', label: 'Environment' },
];

export const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

// NewsData.io country codes. Empty string == worldwide (no country filter).
export const COUNTRIES: { code: string; label: string }[] = [
  { code: '', label: 'Worldwide' },
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'in', label: 'India' },
  { code: 'ca', label: 'Canada' },
  { code: 'au', label: 'Australia' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'jp', label: 'Japan' },
  { code: 'sg', label: 'Singapore' },
  { code: 'ae', label: 'United Arab Emirates' },
];
