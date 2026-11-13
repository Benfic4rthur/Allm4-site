import type { Metadata } from "next";
import PageContent from "./page-content";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Codex Reset — Seu Codex, sempre à vista | ALLM4";
const description = "Sua franquia do Codex, as conversas ativas e o tempo até a renovação no topo do Mac. Codex Reset é gratuito para Apple Silicon e Intel.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/codex-reset/" },
  icons: { icon: [{ url: `${basePath}/products/codex-reset-icon.png`, type: "image/png" }] },
  openGraph: { title, description, url: "/codex-reset/", type: "website", locale: "pt_BR", siteName: "ALLM4", images: [{ url: "/codex-reset/share.png", width: 1200, height: 630, alt: "Codex Reset — Sua franquia do Codex, sempre à vista" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/codex-reset/share.png"] },
};
export default function Page() { return <PageContent />; }
