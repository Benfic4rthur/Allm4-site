"use client";
import { localizeTree, translate, useSiteLanguage } from "../lib/i18n/runtime";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronRight, Command, Power, Settings2, Thermometer } from "lucide-react";

export function Mark({ className = "", spinning = false }: { className?: string; spinning?: boolean }) {
  useSiteLanguage();
  const id = useId().replace(/:/g, "");
  return localizeTree(<svg viewBox="0 0 100 100" fill="none" className={`gela-mark ${className}`} aria-hidden="true">
    <defs><mask id={id}><g stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      {[0, 60, 120, 180, 240, 300].map(a => <path key={a} d="M50 70V94M40 89L50 81L60 89" transform={`rotate(${a} 50 50)`} />)}
    </g><circle cx="50" cy="50" r="23" fill="white" /><g className={spinning ? "mark-rotor rotating" : "mark-rotor"}>
      {[0, 90, 180, 270].map(a => <path key={a} d="M52.2 55C56 57 64 61 61 66C60 70 51 71 47 69C42 69 41 63 43 60C44 57 46 55 47 54.3Z" fill="black" transform={`rotate(${a} 50 50)`} />)}
    </g><circle cx="50" cy="50" r="2.8" fill="black" /></mask></defs>
    <path d="M0 0H100V100H0Z" fill="currentColor" mask={`url(#${id})`} />
  </svg>);
}

export function Fan({ spinning = false, className = "", style }: { spinning?: boolean; className?: string; style?: CSSProperties }) {
  useSiteLanguage();
  return localizeTree(<svg className={`fan ${spinning ? "rotating" : ""} ${className}`} style={style} viewBox="0 0 100 100" aria-hidden="true">
    {[0, 90, 180, 270].map(a => <path key={a} d="M54 42C41 21 51 12 66 16C83 21 89 34 77 42C67 48 60 48 54 42Z" fill="currentColor" transform={`rotate(${a} 50 50)`} />)}<circle cx="50" cy="50" r="8" fill="currentColor" />
  </svg>);
}

export function AppIcon({ size = 44 }: { size?: number }) {
  useSiteLanguage();
  // Original application artwork, converted directly from its ICNS asset.
  // eslint-disable-next-line @next/next/no-img-element
  return localizeTree(<img src="/gelamac/images/gelamac-icon.png" width={size} height={size} alt="" className="app-icon" />);
}

export function Demo({ onSettings }: { onSettings: () => void }) {
  useSiteLanguage();
  const [phase, setPhase] = useState<"idle" | "cooling" | "holding" | "done">("idle");
  const [temp, setTemp] = useState(68);
  const [seconds, setSeconds] = useState(30);
  const [open, setOpen] = useState(true);
  const active = phase === "cooling" || phase === "holding";
  useEffect(() => {
    if (phase !== "cooling" && phase !== "holding") return;
    const timer = window.setTimeout(() => {
      if (phase === "cooling") {
        if (temp <= 55) { setTemp(54); setPhase("holding"); }
        else setTemp(temp - 1);
      } else if (seconds <= 5) { setSeconds(0); setPhase("done"); }
      else setSeconds(seconds - 5);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [phase, temp, seconds]);
  function toggle() {
    if (active) { setPhase("idle"); return; }
    setTemp(68); setSeconds(30); setPhase("cooling");
  }
  return localizeTree(<div className={`hero-scene ${active ? "is-cooling" : ""}`}>
    <div className="scene-grid" data-sc-parallax="-0.95" aria-hidden="true" />
    <div className="scene-emblem" data-sc-parallax="-0.4"><Mark spinning={active} /></div>
    <div className="air-trails" aria-hidden="true"><i /><i /><i /></div>
    <div className="demo-caption"><span className="demo-dot" /> PRÉVIA INTERATIVA <span>clique em Gelar agora</span></div>
    <div className="demo-foreground" data-sc-parallax="0.55">
      <div className="mac-menu-bar"><span className="menu-apple"><Command size={14} /> Finder <span>Arquivo</span></span>
        <button className={`temperature-pill ${active ? "active" : ""}`} onClick={() => setOpen(v => !v)} aria-label={`${open ? "Recolher" : "Abrir"} demonstração do GelaMac`} aria-expanded={open}><Mark spinning={active} /><span>{temp}°</span></button><span className="menu-time">09:41</span>
      </div>
      <div className={`app-popover ${!open ? "popover-closed" : ""}`} inert={!open}>
        <div className="popover-heading"><AppIcon size={40} /><div><strong>GelaMac</strong><span>Um respiro para o seu Mac.</span></div><i className={active ? "activity-dot cooling" : "activity-dot"} /></div>
        <div className="temperature-readout"><div><span className="demo-temperature">{temp}</span><span className="degree">°C</span><Thermometer size={26} /></div><strong>{phase === "holding" ? `No alvo. Mantendo por ${seconds}s` : active ? "Respira. Estamos gelando." : phase === "done" ? "Mais fresco. De volta ao automático." : "Seu Mac está pedindo um respiro."}</strong><small>{active ? "Alvo deste ciclo: 54 °C" : "Temperatura média da CPU"}</small></div>
        <div className="fan-pair">{[1, 2].map(n => <div key={n}><Fan spinning={active} /><div><span>Ventoinha {n}</span><strong>{active ? (n === 1 ? "4.296" : "4.744") : (n === 1 ? "1.687" : "1.739")} <small>RPM</small></strong><small>{active ? "Na rotação máxima" : "Controle do macOS"}</small></div></div>)}</div>
        <button className={`demo-cool-button ${active ? "stop" : ""}`} onClick={toggle}>{active ? <Power size={15} /> : <Mark />} {active ? "Parar resfriamento" : "Gelar agora"}</button>
        <button className="demo-settings" onClick={onSettings}><Settings2 size={15} /><span>Configurações</span><ArrowUpRight size={14} /></button>
        <div className="popover-footer"><span>Monitoramento em segundo plano</span><Power size={12} /></div>
      </div>
      {!open && <button className="demo-reopen" onClick={() => setOpen(true)}><Mark /> Pequeno na barra. Sempre por perto.<ChevronRight size={16} /></button>}
    </div>
    <div className="demo-footnote">Demonstração com valores e tempo ilustrativos.<br />Nenhum ajuste é feito no seu Mac por este site.</div>
  </div>);
}

export function ThermalCycle({ reduced = false }: { reduced?: boolean }) {
  const locale = useSiteLanguage();
  const section = useRef<HTMLElement>(null), temp = useRef<HTMLSpanElement>(null), status = useRef<HTMLSpanElement>(null), caption = useRef<HTMLParagraphElement>(null), left = useRef<HTMLSpanElement>(null), right = useRef<HTMLSpanElement>(null), miniTemp = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    let frame = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const p = (reduced || reduce.matches) ? 1 : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      const cool = Math.max(0, Math.min(1, (p - .08) / .55));
      const holding = p >= .64 && p < .94, done = p >= .94;
      const temperature = Math.round(68 - 14 * cool), seconds = Math.max(0, Math.ceil(30 * (1 - (p - .64) / .30)));
      node.style.setProperty("--cycle", cool.toFixed(4)); node.style.setProperty("--fan-turn", `${p * 2200}deg`);
      node.dataset.cycleState = done ? "done" : holding ? "holding" : "cooling";
      if (temp.current) temp.current.textContent = `${temperature}`;
      if (miniTemp.current) miniTemp.current.textContent = `${temperature}°`;
      if (status.current) status.current.textContent = translate(done ? "O Mac assume de novo." : holding ? `Alvo atingido. Mais ${seconds}s.` : "Duas ventoinhas. Um só objetivo.");
      if (caption.current) caption.current.textContent = translate(done ? "Se a temperatura voltar a subir rapidamente, o ciclo normal pode recomeçar sozinho." : holding ? "Ao permanecer no alvo por 30 segundos, o GelaMac devolve o controle ao macOS." : "As duas trabalham juntas, cada uma no máximo permitido pelo próprio hardware.");
      if (left.current) left.current.textContent = translate(done ? "Automático" : "4.296 RPM");
      if (right.current) right.current.textContent = translate(done ? "Automático" : "4.744 RPM");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule, { passive: true }); reduce.addEventListener("change", schedule); draw();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduce.removeEventListener("change", schedule); cancelAnimationFrame(frame); };
  }, [reduced, locale]);
  return localizeTree(<section id="como-funciona" ref={section} className="thermal-cycle" data-sc-act="pin" data-sc-span="2.7" data-cycle-state="cooling" aria-labelledby="cycle-title">
    <div className="cycle-stage" data-sc-stage>
      <div className="cycle-top container"><h2 id="cycle-title">Esquentou?<br /><span>Deixa com o GelaMac.</span></h2><div className="cycle-mini"><Mark /><span ref={miniTemp}>68°</span><i /></div></div>
      <div className="cooling-apparatus" aria-label="Simulação de um ciclo que resfria de 68 a 54 graus">
        <div className="apparatus-field" aria-hidden="true"><Mark /><div className="field-ring one" /><div className="field-ring two" /></div>
        <div className="apparatus-fan left"><div className="fan-housing"><Fan /></div><span>VENTOINHA 1</span><strong ref={left}>4.296 RPM</strong></div>
        <div className="cycle-number"><span className="cycle-temperature" ref={temp}>68</span><span className="cycle-unit">°C</span><div className="target-line"><span /> ALVO ILUSTRATIVO: 54 °C</div></div>
        <div className="apparatus-fan right"><div className="fan-housing"><Fan /></div><span>VENTOINHA 2</span><strong ref={right}>4.744 RPM</strong></div>
      </div>
      <div className="cycle-bottom"><strong ref={status}>Duas ventoinhas. Um só objetivo.</strong><p ref={caption}>As duas trabalham juntas, cada uma no máximo permitido pelo próprio hardware.</p><div className="cycle-track" aria-hidden="true"><i /></div><small>Simulação de comportamento. A queda real depende da carga e do ambiente.</small></div>
    </div>
  </section>);
}
