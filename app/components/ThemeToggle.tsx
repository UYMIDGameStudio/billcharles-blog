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
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-line2 text-ink2 transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden className="text-[13px] leading-none dark:hidden">
        {'\u263e'}
      </span>
      <span aria-hidden className="hidden text-[13px] leading-none dark:inline">
        {'\u2600'}
      </span>
    </button>
  );
}
