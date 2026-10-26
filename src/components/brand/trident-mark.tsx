/**
 * Marca do site: tridente de Seu Zé Malandro.
 */
export function TridentMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 4v7" />
      <path d="M7 6.5V11" />
      <path d="M17 6.5V11" />
      <path d="M7 6.5 5.6 5.2" />
      <path d="M17 6.5l1.4-1.3" />
      <path d="M7 11h10" />
      <path d="M12 11v7.2" />
      <circle cx="12" cy="20" r="1.3" />
    </svg>
  );
}
