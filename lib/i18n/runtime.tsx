"use client";

import { cloneElement, isValidElement, useSyncExternalStore, type ReactNode } from "react";
import english from "./en.json";
import spanish from "./es.json";

export type SiteLanguage = "pt" | "en" | "es";
export const languages: SiteLanguage[] = ["pt", "en", "es"];
const dictionaries: Record<string, Record<string, string>> = { en: english, es: spanish };
const languageKey = "allm4.language.v1";
let language: SiteLanguage = "pt";
const listeners = new Set<() => void>();
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

const templates = Object.fromEntries(Object.entries(dictionaries).map(([code, dictionary]) => [code,
  Object.entries(dictionary).filter(([pattern]) => pattern.includes("{{")).map(([pattern, replacement]) => ({
    regex: new RegExp("^" + pattern.split(/(\{\{\d+\}\})/).map(part => /^\{\{\d+\}\}$/.test(part) ? "(.+?)" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("") + "$"),
    replacement,
  })),
]));
const translationCache = new Map<string, string>();

export function translate(text: string, locale: SiteLanguage = language): string {
  if (locale === "pt" || !text.trim()) return text;
  const key = normalize(text);
  const cacheKey = locale + ":" + key;
  let result = translationCache.get(cacheKey) ?? dictionaries[locale]?.[key];
  if (result === undefined) {
    for (const { regex, replacement } of templates[locale] ?? []) {
      const match = key.match(regex);
      if (match) { result = replacement.replace(/\{\{(\d+)\}\}/g, (_, index) => dictionaries[locale]?.[match[Number(index) + 1]] ?? match[Number(index) + 1] ?? ""); break; }
    }
    result ??= key;
  }
  if (translationCache.size > 4096) translationCache.clear();
  translationCache.set(cacheKey, result);
  return text.replace(/\S[\s\S]*\S|\S/, result);
}

export function setSiteLanguage(next: SiteLanguage) {
  if (!languages.includes(next)) return;
  try { localStorage.setItem(languageKey, next); } catch { /* Private browsing may disable storage. */ }
  language = next;
  document.documentElement.lang = next === "pt" ? "pt-BR" : next;
  for (const listener of listeners) listener();
  window.dispatchEvent(new CustomEvent("allm4:language", { detail: next }));
}

export function initializeSiteLanguage() {
  let saved: string | null = null;
  try { saved = localStorage.getItem(languageKey); } catch { /* Keep Portuguese as the default. */ }
  const requested = new URLSearchParams(location.search).get("lang");
  const browserLanguage = typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "pt";
  const next = requested ?? saved ?? browserLanguage;
  if (languages.includes(next as SiteLanguage)) setSiteLanguage(next as SiteLanguage);
}

function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useSiteLanguage() { return useSyncExternalStore(subscribe, () => language, () => "pt" as SiteLanguage); }

// Translate React text and descriptive attributes before React updates the DOM.
// Keys, state, handlers, IDs and animation nodes stay intact when switching languages.
export function localizeTree(node: ReactNode): ReactNode {
  if (language === "pt") return node;
  if (typeof node === "string") return translate(node);
  if (Array.isArray(node)) return node.map(localizeTree);
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  const props: Record<string, unknown> = {};
  for (const name of ["aria-label", "aria-valuetext", "alt", "title", "placeholder"]) {
    if (typeof node.props[name] === "string") props[name] = translate(node.props[name]);
  }
  if (node.props.children !== undefined) props.children = node.type === "strong" && node.props.children === "Aplicativos" && language === "en" ? "Applications" : localizeTree(node.props.children as ReactNode);
  return cloneElement(node, props);
}
