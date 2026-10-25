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
    platforms: ["macOS", "Apple Silicon"],
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
    name: "JáCopiei?",
    slug: "jacopiei",
    description:
      "Confira se seus arquivos já têm cópia e guarde em lote o que falta, com uma verificação clara feita no seu Mac.",
    icon: "/products/jacopiei-icon.svg",
    screenshot: "/products/jacopiei-preview.png",
    screenshotAlt:
      "Apresentação oficial do JáCopiei? com janela azul, pasta e confirmação de cópia",
    screenshotWidth: 1730,
    screenshotHeight: 909,
    platforms: ["macOS", "Apple Silicon", "Intel"],
    status: "Disponível",
    url: "/jacopiei/",
    ctaLabel: "Conhecer JáCopiei?",
  },
  {
    name: "Beira",
    slug: "beira",
    description:
      "Brilho e volume na ponta dos dedos. Deslize pelas bordas do trackpad para ajustar seu Mac, com retorno tátil e controle na barra de menus.",
    icon: "/products/beira-icon.svg",
    platforms: ["macOS", "Apple Silicon", "Intel"],
    status: "Gratuito",
    url: "/beira/",
    ctaLabel: "Conhecer Beira",
  },
  {
    name: "Codex Reset",
    slug: "codex-reset",
    description:
      "Sua franquia do Codex sempre à vista. Acompanhe as conversas ativas e o tempo até a renovação em um painel discreto no topo do Mac.",
    icon: "/products/codex-reset-icon.png",
    platforms: ["macOS 14+", "Apple Silicon", "Intel"],
    status: "Gratuito",
    url: "/codex-reset/",
    ctaLabel: "Conhecer Codex Reset",
  },
];
