"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import Image from "next/image";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function BrandMark({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  useSiteLanguage();
  return localizeTree((
    <Image
      className={className}
      src={`${publicBasePath}/brand/allm4-mark.svg`}
      alt={decorative ? "" : "Símbolo da ALLM4"}
      width={256}
      height={256}
      aria-hidden={decorative ? true : undefined}
      unoptimized
    />
  ));
}

export function BrandLockup({
  compact = false,
}: {
  compact?: boolean;
}) {
  useSiteLanguage();
  return localizeTree((
    <a className={`umb-lockup${compact ? " umb-lockup-compact" : ""}`} href="#inicio" aria-label="ALLM4, início">
      <BrandMark className="umb-lockup-mark" decorative />
      <span className="umb-lockup-copy">
        <strong>ALLM4</strong>
        {!compact && <small>SOFTWARE FOR A BRIGHTER DAY</small>}
      </span>
    </a>
  ));
}
