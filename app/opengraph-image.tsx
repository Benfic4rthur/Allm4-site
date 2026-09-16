import { ImageResponse } from "next/og";

export const alt = "Allm4 — Sua IA. No seu computador. Sob seu controle.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#ef7247"/><g fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7.5c1.2 5.5 2.4 8.7 5.3 10.2 2.4 1.2 5.2 1.8 8.2 2.4-3 .7-5.8 1.4-8.2 2.6-2.9 1.5-4.1 4.8-5.3 10.4-1.2-5.6-2.4-8.9-5.3-10.4-2.4-1.2-5.2-1.9-8.2-2.6 3-.6 5.8-1.2 8.2-2.4 2.9-1.5 4.1-4.7 5.3-10.2z"/><path d="M30.2 6.6c.5 2.2 1 3.3 2 3.9.8.4 1.8.7 3 .9-1.2.3-2.2.6-3 .9-1 .6-1.5 1.7-2 3.9-.5-2.2-1-3.3-2-3.9-.8-.3-1.8-.6-3-.9 1.2-.2 2.2-.5 3-.9 1-.6 1.5-1.7 2-3.9z"/><circle cx="9.6" cy="29.4" r="2.2"/><path d="M4.8 29.4h2.5"/></g></svg>`;

const logoSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0f1012",
          color: "#ffffff",
          padding: "0 90px",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width="240" height="240" alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Allm4
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "26px",
              fontSize: "44px",
              lineHeight: 1.2,
              color: "#f3ece8",
            }}
          >
            <div>Sua IA. No seu computador.</div>
            <div>Sob seu controle.</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
