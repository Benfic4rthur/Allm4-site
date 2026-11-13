"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import { TubeOrderReleaseProvider } from "./release";
import TubeOrderSite from "./site-components";
import "./tubeorder.css";

export default function TubeOrderPage() {
  useSiteLanguage(); return localizeTree(<TubeOrderReleaseProvider><TubeOrderSite /></TubeOrderReleaseProvider>); }
