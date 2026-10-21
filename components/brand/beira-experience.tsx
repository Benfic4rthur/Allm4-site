"use client";

import { Check, Copy, MoveVertical, Repeat2, Sun, Volume2 } from "lucide-react";
import { useState, type CSSProperties, type PointerEvent } from "react";
import { beiraInstallCommand } from "@/lib/beira";

type Control = "volume" | "brightness";

export function TrackpadDemo() {
  const [volume, setVolume] = useState(48);
  const [brightness, setBrightness] = useState(72);
  const [swapped, setSwapped] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [active, setActive] = useState<Control | null>(null);
  const left: Control = swapped ? "brightness" : "volume";
  const right: Control = swapped ? "volume" : "brightness";

  function control(side: Control, position: "left" | "right") {
    const value = side === "volume" ? volume : brightness;
    const label = side === "volume" ? "Volume" : "Brilho";
    function update(next: number) {
      setInteracted(true);
      const level = Math.max(0, Math.min(100, Math.round(next)));
      if (side === "volume") setVolume(level); else setBrightness(level);
    }
    function move(event: PointerEvent<HTMLDivElement>) {
      const bounds = event.currentTarget.getBoundingClientRect();
      update((bounds.bottom - event.clientY) / bounds.height * 100);
    }
    return (
      <div className={`beira-demo-edge beira-demo-edge--${position} beira-demo-edge--${side}`}>
        <div
          className="beira-demo-slider"
          role="slider"
          tabIndex={0}
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label={`${label} na demonstração`}
          aria-valuetext={`${value}%`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.currentTarget.focus({ preventScroll: true });
            event.currentTarget.setPointerCapture(event.pointerId);
            setActive(side);
            move(event);
          }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event); }}
          onPointerUp={() => setActive(null)}
          onPointerCancel={() => setActive(null)}
          onLostPointerCapture={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(event) => {
            const values: Record<string, number> = { ArrowUp: value + 1, ArrowRight: value + 1, ArrowDown: value - 1, ArrowLeft: value - 1, PageUp: value + 10, PageDown: value - 10, Home: 0, End: 100 };
            if (!(event.key in values)) return;
            event.preventDefault();
            update(values[event.key]);
          }}
          style={{ "--demo-value": `${value}%` } as CSSProperties}
        ><span className="beira-demo-slider-thumb" aria-hidden="true" /></div>
      </div>
    );
  }

  function readout(side: Control) {
    const value = side === "volume" ? volume : brightness;
    const Icon = side === "volume" ? Volume2 : Sun;
    return (
      <div className={`beira-demo-readout beira-demo-readout--${side}`}>
        <div><Icon size={18} aria-hidden="true" /><span>{side === "volume" ? "Volume" : "Brilho"}</span><strong>{value}<small>%</small></strong></div>
        <span className="beira-demo-meter"><i style={{ width: `${value}%` }} /></span>
      </div>
    );
  }

  return (
    <div className="beira-demo" data-interacted={interacted} data-active={active ?? "none"}>
      <div className="beira-demo-topline">UM GESTO. DOIS CONTROLES.<span>↕</span></div>
      <div className="beira-demo-stage">
        <div className="beira-demo-hud">{readout(left)}{readout(right)}</div>
        <div className="beira-demo-pad">
          {control(left, "left")}
          <div className="beira-demo-center" aria-hidden="true">
            <svg viewBox="0 0 100 70" fill="none"><path d="M25 13H15V57H25M75 13H85V57H75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>o centro continua seu.</span>
          </div>
          {control(right, "right")}
          <div className="beira-demo-trace" aria-hidden="true"><span /></div>
        </div>
        <div className="beira-demo-shadow" />
      </div>
      <div className="beira-demo-bottom">
        <p><MoveVertical size={16} aria-hidden="true" /> Deslize nas bordas para experimentar</p>
        <button type="button" aria-pressed={swapped} onClick={() => { setSwapped(!swapped); setInteracted(true); }}><Repeat2 size={14} aria-hidden="true" /> Inverter lados</button>
      </div>
      <p className="beira-demo-caption">Demonstração interativa. Não altera os ajustes do seu dispositivo.</p>
    </div>
  );
}

export function InstallationCommand() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(beiraInstallCommand);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="beira-command-wrap">
      <div className="beira-command">
        <code>{beiraInstallCommand}</code>
        <button type="button" onClick={copyCommand} aria-label="Copiar comando de instalação">
          {status === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          <span>{status === "copied" ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
      <p className="beira-copy-status" role="status">{status === "copied" ? "Comando copiado. Cole no Terminal depois de mover o Beira para Aplicativos." : status === "error" ? "Selecione o comando acima e copie com ⌘C." : "O comando libera apenas o Beira instalado nesse caminho."}</p>
    </div>
  );
}
