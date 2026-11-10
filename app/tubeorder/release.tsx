"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { fetchTubeOrderRelease, type TubeOrderRelease } from "@/lib/tubeorder";

type ReleaseContextValue = { release: TubeOrderRelease | null; loaded: boolean; refresh: () => Promise<TubeOrderRelease | null> };
const ReleaseContext = createContext<ReleaseContextValue>({ release: null, loaded: false, refresh: async () => null });
export const useTubeOrderRelease = () => useContext(ReleaseContext);

export function TubeOrderReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<TubeOrderRelease | null>(null);
  const [loaded, setLoaded] = useState(false);
  const refreshRef = useRef<() => Promise<TubeOrderRelease | null>>(async () => null);
  const refresh = useCallback(() => refreshRef.current(), []);
  useEffect(() => {
    let disposed = false;
    let pending: Promise<TubeOrderRelease | null> | null = null;
    let controller: AbortController | null = null;
    function request(): Promise<TubeOrderRelease | null> {
      if (pending) return pending;
      const active = new AbortController();
      controller = active;
      const timeout = setTimeout(() => active.abort(), 8000);
      pending = (async () => {
        try {
          const latest = await fetchTubeOrderRelease(fetch, active.signal);
          if (!disposed) { setRelease(latest); setLoaded(true); }
          return latest;
        } finally { clearTimeout(timeout); pending = null; }
      })();
      return pending;
    }
    refreshRef.current = request;
    const visible = () => { if (!document.hidden) void request(); };
    void request();
    const interval = setInterval(visible, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", visible);
    return () => { disposed = true; controller?.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", visible); refreshRef.current = async () => null; };
  }, []);
  return <ReleaseContext.Provider value={{ release, loaded, refresh }}>{children}</ReleaseContext.Provider>;
}
