"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

const titleStyle =
  "background:#5c73ff;color:#ffffff;padding:6px 10px;border-radius:6px;font-weight:800;letter-spacing:.06em";
const warningStyle =
  "color:#a996ff;font-weight:800;font-size:13px;letter-spacing:.02em";
const noteStyle = "color:#8f96a8;font-size:11px";

const allowedContextMenuTarget =
  "a, button, input, textarea, select, option, [contenteditable='true'], code, pre";

export function SecurityConsole() {
  useEffect(() => {
    console.log("%c ALLM4 / ÁREA DOS CURIOSOS ", titleStyle);
    console.log(
      "%c👀 Se você abriu isso procurando um botão secreto, sinto informar: era só curiosidade mesmo.",
      warningStyle,
    );
    console.log("%cPode olhar. Só não quebra a mobília. 😄", noteStyle);
    console.log(
      `%cAchou uma falha real? ${siteConfig.contactEmail}`,
      noteStyle,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const windowsLinuxDevtools =
        event.ctrlKey &&
        event.shiftKey &&
        ["i", "j", "c", "k"].includes(key);

      const macDevtools =
        event.metaKey &&
        event.altKey &&
        ["i", "j", "c", "u"].includes(key);

      const viewSource = event.ctrlKey && key === "u";

      if (
        event.key === "F12" ||
        windowsLinuxDevtools ||
        macDevtools ||
        viewSource
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log(
          "%cBoa tentativa 😄 O atalho foi bloqueado por aqui.",
          warningStyle,
        );
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(allowedContextMenuTarget)
      ) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return null;
}
