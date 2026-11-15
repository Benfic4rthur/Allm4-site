export type StudioGame = {
  slug: string;
  name: string;
  description: string;
  genre: string;
  icon: string;
  image: string;
  imageAlt: string;
  imageLabel?: string;
  imageFit?: "cover" | "contain";
  url: string;
  external?: boolean;
  actionLabel?: string;
};

// Games have their own catalog; they do not enter the application/project grid.
export const games: StudioGame[] = [
  {
    slug: "primalith",
    name: "Primalith",
    description: "Explore uma ilha ancestral, sobreviva entre dinossauros e construa seu abrigo em um mundo voxel. Jogue solo ou com amigos em rede local.",
    genre: "Exploração · Sobrevivência voxel",
    icon: "/games/primalith/assets/primalith-amber.svg",
    image: "/games/primalith/assets/hero-moon.jpg",
    imageAlt: "Costa de Primalith sob o luar, em uma captura real do jogo",
    imageLabel: "Imagens reais do jogo",
    url: "/games/primalith/",
  },
  {
    slug: "fazuellipunk-2077",
    name: "FazuelliPunk 2077",
    description: "Explore uma megafavela neon no Brasil de 2077. Ajude a vizinhança e enfrente a burocracia nesta aventura satírica gratuita para navegador.",
    genre: "Aventura 2D · Sátira brasileira",
    icon: "/games/fazuellipunk-2077/assets/icon.svg",
    image: "/games/fazuellipunk-2077/assets/cover.jpg",
    imageAlt: "Arte oficial de FazuelliPunk 2077, com uma cidade neon em pixel art",
    imageFit: "contain",
    url: "https://fazuellipunk2077.com/",
    external: true,
    actionLabel: "Jogar no navegador",
  },
];
