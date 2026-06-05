'use client';

import { useEffect, useState } from 'react';

type Headline = { id: string; title: string; link: string };

export default function BreakingTicker({ country }: { country: string }) {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const qs = country ? `?country=${country}` : '';
        const res = await fetch(`/api/breaking${qs}`, { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        setHeadlines(Array.isArray(data.headlines) ? data.headlines : []);
        setError(data.error ?? null);
      } catch {
        if (active) setError('Unable to load breaking news right now.');
      }
    }

    load();
    const id = setInterval(load, 60000); // refresh every 60s
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [country]);

  if (error) {
    return (
      <div className="ticker ticker-error">
        <span className="ticker-label">Breaking</span>
        <span className="ticker-msg">{error}</span>
      </div>
    );
  }

  if (headlines.length === 0) {
    return (
      <div className="ticker">
        <span className="ticker-label">Breaking</span>
        <span className="ticker-msg">Loading live headlines…</span>
      </div>
    );
  }

  // Duplicate the list so the marquee scrolls seamlessly.
  const loop = headlines.concat(headlines);

  return (
    <div className="ticker">
      <span className="ticker-label">Breaking</span>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {loop.map((h, i) => (
            <a
              key={`${h.id}-${i}`}
              href={h.link}
              target="_blank"
              rel="noreferrer"
              className="ticker-item"
            >
              {h.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
