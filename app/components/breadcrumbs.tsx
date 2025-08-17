'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Crumb = { href: string; label: string };

const COOKIE_NAME = 'nav_crumbs';
const MAX_CRUMBS = 5;

// Read cookie value by name (client-side)
function readCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

// Write cookie with 7-day expiry (adjust as you like)
function writeCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

// Make a nice label from a pathname (e.g., "/about" -> "About")
function labelFromPath(pathname: string) {
  if (pathname === '/' || pathname === '') return 'Home';
  const parts = pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  // Current page as a crumb
  const currentCrumb = useMemo<Crumb>(() => {
    return { href: pathname, label: labelFromPath(pathname) };
  }, [pathname]);

  // On every route change: update the cookie trail
  useEffect(() => {
    let existing: Crumb[] = [];
    const raw = readCookie(COOKIE_NAME);
    if (raw) {
      try {
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
    }

    // Avoid duplicate if last crumb is same page
    if (existing.length && existing[existing.length - 1].href === currentCrumb.href) {
      setCrumbs(existing);
      return;
    }

    // Remove older same href, append new one, trim to MAX_CRUMBS
    const filtered = existing.filter(c => c.href !== currentCrumb.href);
    const next = [...filtered, currentCrumb].slice(-MAX_CRUMBS);

    writeCookie(COOKIE_NAME, JSON.stringify(next));
    setCrumbs(next);
  }, [currentCrumb]);

  if (!crumbs.length) return null;

  return (
    <nav aria-label="breadcrumb" className="container mt-3">
      <ol className="breadcrumb">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li
              key={`${c.href}-${idx}`}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                c.label
              ) : (
                <Link href={c.href} className="text-decoration-none">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
