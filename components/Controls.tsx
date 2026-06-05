'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { CATEGORIES, COUNTRIES } from '@/lib/constants';

type ControlsProps = {
  activeCategory: string;
  country: string;
  initialQuery?: string;
};

export default function Controls({ activeCategory, country, initialQuery = '' }: ControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  function withCountry(href: string): string {
    return country ? `${href}?country=${country}` : href;
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const suffix = country ? `?country=${country}` : '';
    router.push(`/search/${encodeURIComponent(q)}${suffix}`);
  }

  function onCountry(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const params = new URLSearchParams();
    if (next) params.set('country', next);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <section className="controls">
      <form className="search" onSubmit={onSearch} role="search">
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news…"
          aria-label="Search news"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <nav className="pills" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const href = c.slug === 'top' ? withCountry('/') : withCountry(`/category/${c.slug}`);
          const isActive = activeCategory === c.slug;
          return (
            <Link
              key={c.slug}
              href={href}
              className={`pill${isActive ? ' pill-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>

      <div className="country">
        <label htmlFor="country-select">Country</label>
        <select id="country-select" value={country} onChange={onCountry}>
          {COUNTRIES.map((c) => (
            <option key={c.code || 'world'} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
