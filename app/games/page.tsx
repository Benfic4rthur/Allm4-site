import type { Metadata } from "next";
import GamesContent from "./page-content";

const title = "Games | ALLM4";
const description = "Jogos autorais do ALLM4. Conheça Primalith e explore os mundos que estamos criando.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/games/" },
  openGraph: {
    title,
    description,
    url: "/games/",
    siteName: "ALLM4",
    type: "website",
    images: [{ url: "/games/primalith/assets/hero-moon.jpg", width: 1440, height: 900, alt: "Primalith, um jogo do ALLM4" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/games/primalith/assets/hero-moon.jpg"] },
};

export default function GamesPage() { return <GamesContent />; }
