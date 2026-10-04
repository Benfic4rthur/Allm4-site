import { siteConfig } from "@/lib/site-config";

export type Product = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  screenshot?: string;
  screenshotAlt?: string;
  platforms: string[];
  status?: string;
  url: string;
  ctaLabel: string;
};

export const products: Product[] = [
  {
    // TODO(PRODUCT_NAME): substituir este título descritivo pelo nome oficial do
    // aplicativo quando a separação entre a marca ALLM4 e o produto for concluída.
    name: "IA local no desktop",
    slug: "ia-local",
    description:
      "Converse, crie imagens e trabalhe em projetos com modelos de IA executados no seu computador.",
    icon: "/allm4-google-favicon-96.png",
    screenshot: "/images/allm4-chat-hero-v0138.png",
    screenshotAlt:
      "Interface real do aplicativo atual da ALLM4 com ambientes de chat, imagem e projetos",
    platforms: ["macOS Apple Silicon", "Windows"],
    status: "Disponível",
    url: siteConfig.releases,
    ctaLabel: "Ver releases",
  },
];
