"use client";

import { Check, ChevronDown, Command, Copy, CornerDownLeft, MessageSquare, MousePointer2, Power, RotateCw, Settings2, Wifi } from "lucide-react";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { codexResetInstallCommand } from "@/lib/codex-reset";

type ScreenMode = "notch" | "capsule";

function QuotaRing({ size = 43 }: { size?: number }) {
  return <span className="cr-quota" style={{ "--quota-size": `${size}px` } as CSSProperties}>
    <svg viewBox="0 0 48 48" aria-hidden="true"><circle className="cr-quota-track" cx="24" cy="24" r="20" /><circle className="cr-quota-fill" cx="24" cy="24" r="20" /></svg>
    <strong>87<small>%</small></strong>
  </span>;
}

export function CodexResetDemo() {
  const [mode, setMode] = useState<ScreenMode>("notch");
  const [expanded, setExpanded] = useState(true);

  function enter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") setExpanded(true);
  }

  function leave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") setExpanded(false);
  }

  return <div className="cr-demo" aria-label="Demonstração interativa do Codex Reset">
    <div className="cr-demo-label">UM OLHAR. TUDO NO SEU LUGAR.<span>01 / DEMO</span></div>
    <div className="cr-laptop">
      <div className="cr-screen" data-mode={mode}>
        <div className="cr-menu-bar" aria-hidden="true"><Command size={11} /><strong>Seu Mac</strong><span>Arquivo</span><span>Editar</span><i /><Wifi size={13} /><span className="cr-demo-battery">80</span><span>09:41</span></div>
        <div className="cr-wallpaper" aria-hidden="true"><i /><i /><i /><div className="cr-desktop-note"><span>MENOS INTERRUPÇÕES.</span><strong>Mais espaço<br />para criar.</strong><div><span /><span /><span /></div></div></div>
        <div className="cr-monitor" data-expanded={expanded} onPointerEnter={enter} onPointerLeave={leave} onKeyDown={(event) => { if (event.key === "Escape") setExpanded(false); }}>
          <button type="button" className="cr-monitor-top" aria-expanded={expanded} aria-controls="cr-demo-details" aria-label={expanded ? "Recolher detalhes do monitor" : "Abrir detalhes do monitor"} onClick={() => setExpanded(!expanded)}>
            <span className="cr-monitor-quota"><QuotaRing /><span className="cr-capsule-quota"><strong>87<small>%</small></strong><i /></span></span>
            <span className="cr-camera" aria-hidden="true"><i /></span>
            <span className="cr-monitor-activity"><span>Seu projeto <ChevronDown size={11} aria-hidden="true" /></span><small>Modelo ativo <b>Alto</b></small></span>
          </button>
          <div className="cr-monitor-details" id="cr-demo-details" hidden={!expanded}>
            <div className="cr-panel-toolbar" aria-hidden="true"><RotateCw size={12} /><Power size={12} /><Settings2 size={12} /></div>
            <div className="cr-panel-countdowns"><div><span>RESET EXTRA</span><strong>Entre 1d 18h e 3d 9h</strong><small>Estimativa histórica</small></div><div><span>RESET SEMANAL</span><strong>Em 6d 17h</strong><small>Informado pelo Codex</small></div></div>
            <div className="cr-panel-bottom"><span><RotateCw size={10} /> Último reset · há 6h</span><span>2 conversas ativas</span></div>
          </div>
        </div>
        <div className="cr-desktop-dock" aria-hidden="true"><span>↗</span><span>⌘</span><span>⌁</span><span>◉</span><i /><span>▱</span></div>
      </div>
      <div className="cr-laptop-base"><i /></div>
    </div>
    <div className="cr-demo-controls"><div className="cr-segmented" role="group" aria-label="Tipo de tela da demonstração"><button type="button" aria-pressed={mode === "notch"} onClick={() => setMode("notch")}>Com notch</button><button type="button" aria-pressed={mode === "capsule"} onClick={() => setMode("capsule")}>Sem notch</button></div><span><MousePointer2 size={12} aria-hidden="true" /> Passe o mouse ou toque no painel</span></div>
    <p className="cr-demo-disclaimer">Demonstração com dados ilustrativos. A página não acessa sua conta.</p>
  </div>;
}

const fieldOptions = [
  { id: "project", label: "Projeto", value: "Seu projeto" },
  { id: "model", label: "Modelo", value: "Modelo ativo" },
  { id: "effort", label: "Esforço", value: "Alto" },
  { id: "threads", label: "Conversas", value: "2 ativas" },
  { id: "tokens", label: "Saída/s", value: "42 tok/s" },
] as const;
type Field = (typeof fieldOptions)[number]["id"];
const presets: { name: string; fields: Field[] }[] = [
  { name: "Essencial", fields: [] },
  { name: "Conversas", fields: ["project", "model", "effort"] },
  { name: "Meu ritmo", fields: ["project", "tokens", "threads"] },
];

export function CodexResetCustomizer() {
  const [fields, setFields] = useState<Field[]>(["project", "model", "effort"]);
  function toggle(id: Field) { setFields((current) => current.includes(id) ? current.filter((field) => field !== id) : [...current, id]); }
  return <div className="cr-customizer">
    <div className="cr-customizer-heading"><span>Seu painel, do seu jeito</span><Settings2 size={15} aria-hidden="true" /></div>
    <div className="cr-customizer-body">
      <div className="cr-preset-row" role="group" aria-label="Exemplos de organização do painel">{presets.map((preset) => <button key={preset.name} type="button" aria-pressed={preset.fields.length === fields.length && preset.fields.every((field) => fields.includes(field))} onClick={() => setFields([...preset.fields])}>{preset.name}</button>)}</div>
      <div className="cr-customizer-preview" aria-label="Prévia ampliada do painel do Codex Reset">
        <div className="cr-layout-key" aria-label="Disposição das informações"><div><span>À ESQUERDA</span><strong>Sua franquia</strong></div><div><span>NO CENTRO</span><strong>Câmera do Mac</strong></div><div><span>À DIREITA</span><strong>Seus campos</strong></div></div>
        <div className="cr-editor-notch">
          <div className="cr-customizer-monitor"><QuotaRing size={54} /><span className="cr-customizer-camera"><i /></span><div className="cr-customizer-fields" aria-live="polite">{fields.length ? fields.map((id) => <span key={id}>{fieldOptions.find((option) => option.id === id)?.value}</span>) : <span className="cr-empty-field">Sem campos extras</span>}</div></div>
          <div className="cr-editor-toolbar" aria-hidden="true"><RotateCw size={14} /><Power size={14} /><Settings2 size={14} /></div>
          <div className="cr-customizer-detail"><div><span>RESET EXTRA</span><strong>Entre 1d 18h e 3d 9h</strong><small>Estimativa histórica</small></div><div><span>RESET SEMANAL</span><strong>Em 6d 17h</strong><small>Informado pelo Codex</small></div></div>
        </div>
      </div>
      <p className="cr-fields-hint">Experimente: clique para adicionar ou remover informações.</p>
      <div className="cr-field-options" role="group" aria-label="Informações da prévia">{fieldOptions.map((field) => <button type="button" key={field.id} aria-pressed={fields.includes(field.id)} onClick={() => toggle(field.id)}>{fields.includes(field.id) ? <Check size={12} aria-hidden="true" /> : <span aria-hidden="true">+</span>}{field.label}</button>)}</div>
      <p className="cr-customizer-note"><CornerDownLeft size={12} aria-hidden="true" /> No aplicativo, arraste os campos e ajuste também as linhas de detalhes.</p>
    </div>
  </div>;
}

export function CodexResetInstallCommand() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(codexResetInstallCommand);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
      const selection = window.getSelection();
      const range = document.createRange();
      if (codeRef.current && selection) {
        range.selectNodeContents(codeRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
  return <div className="cr-command"><div><span>TERMINAL · APÓS COPIAR PARA APLICATIVOS</span><button type="button" onClick={copy}>{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copiado" : "Copiar comando"}</button></div><pre><code ref={codeRef}>{codexResetInstallCommand}</code></pre><span className="cr-command-status" role="status">{failed ? "Comando selecionado. Copie com ⌘C." : copied ? "Comando copiado. Cole no Terminal para liberar a primeira abertura." : ""}</span></div>;
}

export function CodexResetActivityMark() {
  return <div className="cr-activity-mark" aria-hidden="true"><MessageSquare size={20} strokeWidth={1.4} /><span /><span /><span /><span /><span /><span /><span /></div>;
}
