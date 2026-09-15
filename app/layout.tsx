import type { Metadata } from "next";
import "./globals.css";

const favicon32 = "/allm4-favicon-v4-32.png?v=5";
const appleTouchIcon = "/allm4-touch-v4.png?v=5";

export const metadata: Metadata = {
  title: "Allm4 — Sua IA. No seu computador. Sob seu controle.",
  description:
    "Transforme seu computador em um ambiente próprio de inteligência artificial. Conheça o Allm4 para macOS Apple Silicon e Windows.",
  icons: {
    icon: [{ url: favicon32, type: "image/png", sizes: "32x32" }],
    apple: appleTouchIcon,
  },
};

const safariOpaqueScriptErrorGuard = `
(() => {
  try {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return;

    window.addEventListener(
      "error",
      (event) => {
        if (
          event instanceof ErrorEvent &&
          event.message === "Script error." &&
          !event.filename &&
          !event.error
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true,
    );
  } catch {
    // Never interfere with page startup if the development guard cannot install.
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: safariOpaqueScriptErrorGuard }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
