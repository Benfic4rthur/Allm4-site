import type { Metadata } from "next";
import PageContent from "./page-content";
const title = "ALLM4 Local IA — IA local simples para qualquer pessoa";
const description =
  "Converse, crie imagens e trabalhe em projetos com IA local, mesmo sem conhecimento técnico. ALLM4 Local IA para macOS Apple Silicon e Windows.";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/local-ia",
    siteName: "ALLM4",
    title,
    description,
    images: [
      {
        url: "/images/allm4-social-preview-v2.png",
        width: 1200,
        height: 630,
        alt: "ALLM4 Local IA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/allm4-social-preview-v2.png"],
  },
};
export default function Page() { return <PageContent />; }
