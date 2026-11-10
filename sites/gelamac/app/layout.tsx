import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://allm4.com"),
  title: "GelaMac | Um respiro para o seu Mac",
  description: "Temperatura à vista, duas ventoinhas em conjunto e resfriamento na hora certa. Conheça o GelaMac, um pequeno cuidado na barra de menus do macOS.",
  openGraph: {
    title: "GelaMac | Seu Mac. De cabeça fria.",
    description: "Um respiro para o seu Mac. Temperatura na barra de menus e resfriamento do seu jeito.",
    url: "https://allm4.com/gelamac/",
    siteName: "ALLM4",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/gelamac/images/gelamac-icon.png", width: 1024, height: 1024, alt: "Ícone do GelaMac: neve com uma ventoinha" }],
  },
  alternates: { canonical: "https://allm4.com/gelamac/" },
  twitter: { card: "summary_large_image", title: "GelaMac | Seu Mac. De cabeça fria.", description: "Um respiro para o seu Mac. Temperatura na barra de menus e resfriamento do seu jeito.", images: ["/gelamac/images/gelamac-icon.png"] },
  icons: {
    icon: "/gelamac/images/gelamac-icon.png",
    shortcut: "/gelamac/images/gelamac-icon.png",
    apple: "/gelamac/images/gelamac-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
