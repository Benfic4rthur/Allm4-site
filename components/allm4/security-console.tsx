"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

const titleStyle =
  "background:#f67c52;color:#17120f;padding:6px 10px;border-radius:6px;font-weight:800;letter-spacing:.04em";
const warningStyle =
  "color:#f6a47f;font-weight:800;font-size:13px;letter-spacing:.02em";
const noteStyle = "color:#8f8f88;font-size:11px";

export function SecurityConsole() {
  useEffect(() => {
    console.log("%c ALLM4 / LOCAL AI ", titleStyle);
    console.log("%cPARA DE DAR UMA DE HACKER AQUI, CURIOSO 😄", warningStyle);
    console.log("%cPode olhar. Só não tenta quebrar a casa. 😉", noteStyle);
    console.log(
      `%cEncontrou uma falha real? ${siteConfig.contactEmail}`,
      noteStyle,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const devtoolsShortcut =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          ["i", "j", "c"].includes(key));

      if (devtoolsShortcut) {
        console.log("%c👀 Eu vi isso aí. Curioso mesmo, hein?", warningStyle);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
