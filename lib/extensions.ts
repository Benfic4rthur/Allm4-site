export type BrowserExtension = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  platforms: string[];
  status: string;
  url: string;
  ctaLabel: string;
};

export const extensions: BrowserExtension[] = [
  {
    name: "CanalNonGrato",
    slug: "canalnongrato",
    description:
      "Seu feed, suas regras. Bloqueie canais indesejados no YouTube e abra espaço para o que você gosta, nos vídeos, Shorts, pesquisas e recomendações.",
    icon: "/canalnongrato/brand/canalnongrato.svg",
    platforms: ["Microsoft Edge", "Google Chrome", "Computador"],
    status: "Gratuita",
    url: "/canalnongrato/",
    ctaLabel: "Conhecer extensão",
  },
];
