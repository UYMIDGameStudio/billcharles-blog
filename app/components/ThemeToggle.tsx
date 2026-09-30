'use client';

export default function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.getAttribute('data-theme') !== 'dark';
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
      className="theme-toggle"
    >
      <span aria-hidden className="text-[18px] leading-none dark:hidden">
        {'\u263e'}
      </span>
      <span aria-hidden className="hidden text-[18px] leading-none dark:inline">
        {'\u2600'}
      </span>
    </button>
  );
}
