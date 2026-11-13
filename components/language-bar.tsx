"use client";

import { useEffect, useRef } from "react";
import { initializeSiteLanguage, languages, setSiteLanguage, translate, useSiteLanguage } from "@/lib/i18n/runtime";

export function LanguageBar() {
  const locale = useSiteLanguage();
  const metadataState = useRef(new WeakMap<Element, { original: string; output: string }>());
  useEffect(() => {
    initializeSiteLanguage();
    const syncLanguage = (event: StorageEvent) => { if (event.key === "allm4.language.v1") initializeSiteLanguage(); };
    window.addEventListener("storage", syncLanguage);
    return () => window.removeEventListener("storage", syncLanguage);
  }, []);
  useEffect(() => {
    function updateMetadata() {
      for (const element of document.head.querySelectorAll('title,meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]')) {
        const current = element.tagName === "TITLE" ? element.textContent ?? "" : element.getAttribute("content") ?? "";
        const state = metadataState.current.get(element);
        const original = state?.output === current ? state.original : current;
        const output = translate(original, locale);
        metadataState.current.set(element, { original, output });
        if (current !== output) {
          if (element.tagName === "TITLE") element.textContent = output;
          else element.setAttribute("content", output);
        }
      }
    }
    updateMetadata();
    const observer = new MutationObserver(updateMetadata);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["content"] });
    return () => observer.disconnect();
  }, [locale]);
  return <nav className="allm4-language-bar" aria-label="Language / Idioma">
    <span className="allm4-language-icon" aria-hidden="true">◎</span>
    {languages.map(code => <button key={code} type="button" lang={code === "pt" ? "pt-BR" : code} aria-label={{ pt: "Português", en: "English", es: "Español" }[code]} aria-pressed={locale === code} onClick={() => setSiteLanguage(code)}>{code.toUpperCase()}</button>)}
  </nav>;
}
