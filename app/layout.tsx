import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Allm4 — Sua IA. No seu computador. Sob seu controle.",
  description:
    "Transforme seu computador em um ambiente próprio de inteligência artificial. Conheça o Allm4 para macOS Apple Silicon e Windows.",
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
        <link rel="icon" href="/icon.svg?v=3" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=3" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{ __html: safariOpaqueScriptErrorGuard }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
