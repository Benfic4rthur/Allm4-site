import type { Metadata } from "next";
import Script from "next/script";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "./scoped.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "JáCopiei? — Você copiou. Mas copiou tudo?",
  description:
    "Descubra o que já está copiado e guarde o que ainda falta. Compare e copie arquivos localmente no Mac.",
  alternates: { canonical: "/jacopiei/" },
  icons: { icon: "/jacopiei/assets/brand.svg" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/jacopiei/",
    siteName: "JáCopiei? by ALLM4",
    title: "JáCopiei? — Você copiou. Mas copiou tudo?",
    description:
      "Descubra o que já está copiado. Guarde o que ainda falta. Comparação e cópia em lote, direto no seu Mac.",
    images: [
      {
        url: "/jacopiei/assets/social.png",
        width: 1730,
        height: 909,
        alt: "JáCopiei? — Você copiou. Mas copiou tudo?",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

// The original site remains in JACOPIEI-SITE. This route serves its published
// markup within the ALLM4 site, preserving its demo and download behavior.
function originalSiteBody(): string {
  const html = readFileSync(join(process.cwd(), "public/jacopiei/index.html"), "utf8");
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) throw new Error("JáCopiei site is missing its body markup");

  return match[1]
    .replace(/<script\b[^>]*src=["']\.\/app\.js["'][^>]*><\/script>/gi, "")
    .replaceAll('="./', '="/jacopiei/');
}

export default function JaCopieiPage() {
  return (
    <>
      <div className="jacopiei-site" dangerouslySetInnerHTML={{ __html: originalSiteBody() }} />
      <Script src="/jacopiei/app.js" type="module" strategy="afterInteractive" />
    </>
  );
}
