const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function BrandMark({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <img
      className={className}
      src={`${publicBasePath}/brand/allm4-mark.svg`}
      alt={decorative ? "" : "Símbolo da ALLM4"}
      width={256}
      height={256}
      aria-hidden={decorative ? true : undefined}
    />
  );
}

export function BrandLockup({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <a className={`umb-lockup${compact ? " umb-lockup-compact" : ""}`} href="#inicio" aria-label="ALLM4, início">
      <BrandMark className="umb-lockup-mark" decorative />
      <span className="umb-lockup-copy">
        <strong>ALLM4</strong>
        {!compact && <small>SOFTWARE FOR A BRIGHTER DAY</small>}
      </span>
    </a>
  );
}
