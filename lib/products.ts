export type Product = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  screenshot?: string;
  screenshotAlt?: string;
  screenshotWidth?: number;
  screenshotHeight?: number;
  platforms: string[];
  status?: string;
  url: string;
  ctaLabel: string;
};

export const products: Product[] = [
  {
    name: "Notchficator",
    slug: "notchficator",
    description:
      "Acompanhe vídeo no notch enquanto trabalha em outro app, com música, controles e avisos em uma experiência nativa para macOS.",
    icon: "/products/notchficator-icon.png",
    screenshot: "/products/notchficator-preview.png",
    screenshotAlt:
      "Apresentação oficial do Notchficator em um MacBook com mini vídeo no notch",
    screenshotWidth: 1200,
    screenshotHeight: 630,
    platforms: ["macOS"],
    status: "Disponível",
    url: "https://notchficator.app",
    ctaLabel: "Visitar notchficator.app",
  },
  {
    name: "LUM4",
    slug: "lum4",
    description:
      "Boost XDR nativo para macOS, com controle simples e IA local que aprende suas preferências em Macs compatíveis com tela XDR.",
    icon: "/products/lum4-icon.png",
    screenshot: "/products/lum4-preview.png",
    screenshotAlt:
      "Apresentação oficial do LUM4 com seu símbolo e a frase Mais luz para o que importa",
    screenshotWidth: 1200,
    screenshotHeight: 630,
    platforms: ["macOS", "Apple Silicon", "Tela XDR"],
    status: "Disponível",
    url: "https://lum4.app",
    ctaLabel: "Visitar lum4.app",
  },
  {
    name: "ALLM4 Local IA",
    slug: "allm4-local-ia",
    description:
      "Converse, crie imagens e trabalhe em projetos com modelos de IA executados no seu computador.",
    icon: "/allm4-google-favicon-96.png",
    screenshot: "/images/allm4-chat-hero-v0138.png",
    screenshotAlt:
      "Interface real do ALLM4 Local IA com ambientes de chat, imagem e projetos",
    screenshotWidth: 3456,
    screenshotHeight: 2024,
    platforms: ["macOS Apple Silicon", "Windows"],
    status: "Disponível",
    url: "/local-ia",
    ctaLabel: "Conhecer ALLM4 Local IA",
  },
];
