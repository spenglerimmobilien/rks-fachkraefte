export function MountainSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 200"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 200 L180 60 L320 130 L480 40 L620 110 L780 25 L920 90 L1080 50 L1200 80 L1200 200 Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M0 200 L220 100 L400 160 L560 70 L720 140 L900 55 L1100 120 L1200 90 L1200 200 Z"
        fill="currentColor"
        opacity="0.05"
      />
    </svg>
  );
}
