import type { Metadata } from "next";
import { TubeOrderReleaseProvider } from "./release";
import TubeOrderSite from "./site-components";
import "./tubeorder.css";

const title = "TubeOrder — Seu tempo, na ordem certa. | ALLM4";
const description = "Organize os vídeos do Assistir mais tarde do YouTube por duração. Baixe o TubeOrder para Chrome e Edge, confira o código e siga a instalação manual.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://allm4.com/tubeorder/" },
  icons: { icon: "/tubeorder/brand/tubeorder.svg", shortcut: "/tubeorder/brand/tubeorder.svg" },
  openGraph: { title, description, url: "https://allm4.com/tubeorder/", siteName: "ALLM4", locale: "pt_BR", type: "website", images: [{ url: "/tubeorder/share.png", width: 1200, height: 630, alt: "TubeOrder — Seu tempo, na ordem certa. Uma extensão ALLM4." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/tubeorder/share.png"] },
};
export default function TubeOrderPage() { return <TubeOrderReleaseProvider><TubeOrderSite /></TubeOrderReleaseProvider>; }
