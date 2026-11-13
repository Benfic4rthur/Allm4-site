import type { Metadata } from "next";
import PageContent from "./page-content";
export const metadata: Metadata = {
    title: "CanalNonGrato — Seu feed, suas regras. | ALLM4",
    description: "Bloqueie canais indesejados no YouTube: vídeos, Shorts, recomendações e pesquisas. Baixe o CanalNonGrato para Edge e Chrome e siga o guia de instalação.",
    alternates: { canonical: "https://allm4.com/canalnongrato/" },
    icons: { icon: "/canalnongrato/brand/canalnongrato.svg" },
    openGraph: {
        title: "CanalNonGrato — Seu feed, suas regras. | ALLM4",
        description: "Bloqueie canais indesejados no YouTube: vídeos, Shorts, recomendações e pesquisas. Baixe o CanalNonGrato para Edge e Chrome e siga o guia de instalação.",
        url: "https://allm4.com/canalnongrato/",
        siteName: "ALLM4",
        locale: "pt_BR",
        type: "website",
        images: [{ url: "/canalnongrato/share.png", width: 1200, height: 630, alt: "CanalNonGrato — Seu feed, suas regras. Uma extensão ALLM4." }],
    },
    twitter: { card: "summary_large_image", title: "CanalNonGrato — Seu feed, suas regras. | ALLM4", description: "Bloqueie canais indesejados no YouTube: vídeos, Shorts, recomendações e pesquisas. Baixe o CanalNonGrato para Edge e Chrome e siga o guia de instalação.", images: ["/canalnongrato/share.png"] },
};
export default function Page() { return <PageContent />; }
