"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

const titleStyle =
  "background:#5c73ff;color:#ffffff;padding:6px 10px;border-radius:6px;font-weight:800;letter-spacing:.06em";
const warningStyle =
  "color:#a996ff;font-weight:800;font-size:13px;letter-spacing:.02em";
const noteStyle = "color:#8f96a8;font-size:11px";

const editableTarget =
  "input, textarea, select, [contenteditable]:not([contenteditable='false'])";
const allowedContextMenuTarget =
  `a, button, option, code, pre, ${editableTarget}`;

export function SecurityConsole() {
  useEffect(() => {
    console.log("%c ALLM4 / ÁREA DOS CURIOSOS ", titleStyle);
    console.log(
      "%c👀 F12 não desbloqueia o modo hacker. Mas a curiosidade tá em dia. 😄",
      warningStyle,
    );
    console.log("%cPode olhar. Só não quebra a mobília. 😄", noteStyle);
    console.log(
      `%cAchou uma falha real? ${siteConfig.contactEmail}`,
      noteStyle,
    );

    let pointerContextMenu = false;

    const onPointerDown = (event: PointerEvent) => {
      pointerContextMenu =
        event.button === 2 || (event.button === 0 && event.ctrlKey);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      pointerContextMenu = false;

      if (
        event.target instanceof Element &&
        event.target.closest(editableTarget)
      ) {
        return;
      }

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
        key === "f12" ||
        windowsLinuxDevtools ||
        macDevtools ||
        viewSource
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log(
          "%cBoa tentativa, curioso 😄 Esse atalho ficou do lado de fora.",
          warningStyle,
        );
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      const fromPointer = pointerContextMenu;
      pointerContextMenu = false;
      const target = event.target;

      if (
        !fromPointer ||
        window.getSelection()?.toString() ||
        (target instanceof Element &&
          target.closest(allowedContextMenuTarget))
      ) {
        return;
      }

      event.preventDefault();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("contextmenu", onContextMenu);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return null;
}
