import type { Metadata } from "next";
import { CardParallax } from "@/components/allm4/card-parallax";
import { SecurityConsole } from "@/components/allm4/security-console";
import "./globals.css";

const faviconIco = "/favicon-v6.ico?v=7";
const favicon32 = "/favicon-32x32-v6.png?v=7";
const appleTouchIcon = "/allm4-touch-v5.png?v=7";
const isProduction = process.env.NODE_ENV === "production";

const productionCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "connect-src 'self' https://api.github.com",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  title: "Allm4 — Sua IA. No seu computador. Sob seu controle.",
  description:
    "Transforme seu computador em um ambiente próprio de inteligência artificial. Conheça o Allm4 para macOS Apple Silicon e Windows.",
  icons: {
    icon: [
      { url: faviconIco, type: "image/x-icon", sizes: "any" },
      { url: favicon32, type: "image/png", sizes: "32x32" },
    ],
    shortcut: faviconIco,
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
  } catch {}
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
        {isProduction && (
          <meta httpEquiv="Content-Security-Policy" content={productionCsp} />
        )}
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" href={faviconIco} sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
        <link rel="shortcut icon" href={faviconIco} />
        {!isProduction && (
          <script
            dangerouslySetInnerHTML={{ __html: safariOpaqueScriptErrorGuard }}
          />
        )}
      </head>
      <body className="antialiased">
        <SecurityConsole />
        <CardParallax />
        {children}
      </body>
    </html>
  );
}
