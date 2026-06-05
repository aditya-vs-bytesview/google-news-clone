import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'NewsHub — a Google News clone powered by NewsData.io',
  description:
    'Live headlines, category filters, country selection and a breaking-news ticker, powered by the NewsData.io REST API.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">N</span>
              <span>NewsHub</span>
            </Link>
            <span className="powered">
              powered by{' '}
              <a href="https://newsdata.io" target="_blank" rel="noreferrer">
                NewsData.io
              </a>
            </span>
          </div>
        </header>
        <div className="container">{children}</div>
        <footer className="site-footer container">
          <p>
            Headlines via the{' '}
            <a href="https://newsdata.io/documentation" target="_blank" rel="noreferrer">
              NewsData.io API
            </a>
            . Demo project — runs on the free tier.
          </p>
        </footer>
      </body>
    </html>
  );
}
