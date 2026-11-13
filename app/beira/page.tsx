import type { Metadata } from "next";
import PageContent from "./page-content";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Beira — Brilho e volume na ponta dos dedos | ALLM4";
const description = "Controle o brilho e o volume do Mac com gestos nas bordas do trackpad. Conheça o Beira, experimente a demonstração e baixe gratuitamente para Apple Silicon ou Intel.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/beira/" },
  icons: { icon: [{ url: `${basePath}/products/beira-icon.svg`, type: "image/svg+xml" }] },
  openGraph: { title, description, url: "/beira/", siteName: "ALLM4", type: "website", locale: "pt_BR", images: [{ url: "/beira/share.png", width: 1200, height: 630, alt: "Beira — brilho e volume na ponta dos dedos" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/beira/share.png"] },
};
export default function Page() { return <PageContent />; }
