'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const value = next ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', value);
    try {
      localStorage.setItem('theme', value);
    } catch {
      /* storage may be blocked; ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-line2 text-ink2 transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden className="text-[13px] leading-none">
        {dark ? '\u2600' : '\u263e'}
      </span>
    </button>
  );
}
