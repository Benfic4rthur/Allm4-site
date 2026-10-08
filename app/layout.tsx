import type { Metadata } from "next";
import { SecurityConsole } from "@/components/allm4/security-console";
import "./globals.css";

const brandIcon = "/brand/allm4-mark.svg";
const isProduction = process.env.NODE_ENV === "production";

const title = "ALLM4 | Software para uma vida mais simples";
const description =
  "Conheça os apps da ALLM4: software útil, simples e bem construído para o dia a dia.";
const socialImage = "/images/allm4-share.png";

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
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://allm4-license-server.vercel.app https://jacopiei-license-server.vercel.app",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  metadataBase: new URL("https://allm4.com"),
  title,
  description,
  icons: {
    icon: [{ url: brandIcon, type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "ALLM4",
    title,
    description,
    images: [{
      url: socialImage,
      width: 1200,
      height: 630,
      alt: "ALLM4 — Software para uma vida mais simples",
      type: "image/png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
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
        {!isProduction && (
          <script
            dangerouslySetInnerHTML={{ __html: safariOpaqueScriptErrorGuard }}
          />
        )}
      </head>
      <body className="antialiased"><SecurityConsole />{children}</body>
    </html>
  );
}
