export default function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `link-arrow ${className}` : 'link-arrow'}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12 12 4M4 4h8v8" />
    </svg>
  );
}
