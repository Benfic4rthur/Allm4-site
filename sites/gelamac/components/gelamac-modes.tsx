"use client";

import { useState } from "react";
import { ChevronRight, Power, Settings2 } from "lucide-react";
import { Mark } from "./gelamac-demo";

const modes = {
  cycle: { name: "Gelar agora", description: "Um clique, potência máxima. O ciclo termina depois de manter a temperatura alvo por 30 segundos.", label: "Um respiro na hora certa.", text: "Você escolhe quando agir. Ou define uma temperatura para o GelaMac começar sozinho.", detail: "O alvo é a temperatura de aviso menos a queda desejada, entre 5 e 10 °C." },
  curve: { name: "Curva de rotação", description: "Mais silêncio quando está tranquilo. Mais ventilação à medida que a temperatura sobe.", label: "A intensidade certa, grau a grau.", text: "Salve quatro pontos de temperatura e rotação. Ative ou desative a curva quando quiser, sem perder seu perfil.", detail: "Com a curva ligada, ela tem prioridade. Os ciclos de Gelar e os avisos ficam em pausa." },
  persistent: { name: "Gelar persistente", description: "As duas ventoinhas no máximo, pelo tempo que você decidir. Você encerra quando quiser.", label: "Vai exigir mais do Mac?", text: "Mantenha o resfriamento máximo durante aquela tarefa mais pesada. Quando terminar, devolva o controle ao sistema.", detail: "Disponível com a curva desligada. Cada ventoinha respeita o próprio limite de rotação." },
};
type Mode = keyof typeof modes;
const points = [{ t: 55, p: 0 }, { t: 60, p: 30 }, { t: 65, p: 70 }, { t: 70, p: 100 }];

export function ModeLab() {
  const [mode, setMode] = useState<Mode>("curve"), [temperature, setTemperature] = useState(65), [enabled, setEnabled] = useState(true);
  const data = modes[mode];
  function percent(t: number) {
    if (!enabled || t <= 55) return 0;
    if (t >= 70) return 100;
    const index = t < 60 ? 0 : t < 65 ? 1 : 2;
    const a = points[index], b = points[index + 1];
    return Math.round(a.p + (b.p - a.p) * (t - a.t) / (b.t - a.t));
  }
  const rpm = percent(temperature), cx = 48 + (temperature - 50) / 25 * 440, cy = 235 - rpm * 1.85;
  return <section id="seu-jeito" className="mode-section container" data-sc-act="flow" aria-labelledby="modes-title">
    <div className="mode-heading" data-sc-in><h2 id="modes-title">Calmo no dia a dia.<br /><span>Intenso quando precisa.</span></h2><p>Três formas de cuidar da temperatura.<br />Você escolhe como o GelaMac entra em ação.</p></div>
    <div className="mode-layout">
      <div className="mode-choices" role="tablist" aria-label="Modos de resfriamento" aria-orientation="vertical">
        {(Object.keys(modes) as Mode[]).map((key, i) => <button key={key} type="button" role="tab" aria-selected={mode === key} aria-controls="mode-preview" id={`mode-${key}`} tabIndex={mode === key ? 0 : -1} className={`mode-choice ${mode === key ? "selected" : ""}`} onClick={() => setMode(key)} onKeyDown={event => {
          if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault(); const keys = Object.keys(modes) as Mode[];
            const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (i + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : 2)) % 3;
            setMode(keys[next]); document.getElementById(`mode-${keys[next]}`)?.focus();
          }
        }}><div>{key === "cycle" ? <Mark /> : key === "curve" ? <Settings2 /> : <Power />}<strong>{modes[key].name}</strong><ChevronRight /></div><p>{modes[key].description}</p></button>)}
      </div>
      <div id="mode-preview" className="mode-preview" data-sc-reveal="up" data-sc-reveal-at="0.12 0.36" role="tabpanel" aria-labelledby={`mode-${mode}`} tabIndex={0}>
        <div className="mode-preview-top"><span>{mode === "curve" ? "SUA CURVA, SEU RITMO" : mode === "cycle" ? "CICLO DE RESFRIAMENTO" : "RESFRIAMENTO CONTÍNUO"}</span>{mode === "curve" && <button className={`switch ${enabled ? "on" : ""}`} role="switch" aria-checked={enabled} aria-label="Ativar curva da demonstração" onClick={() => setEnabled(v => !v)}><i /></button>}</div>
        {mode === "curve" ? <>
          <div className="curve-value"><span>{temperature}<small> °C</small></span><div><strong>{!enabled || temperature <= 55 ? "Automático do macOS" : `${rpm}% de rotação`}</strong><span>{enabled ? "Curva ilustrativa ativa" : "Curva salva, desativada"}</span></div></div>
          <svg className="curve-chart" viewBox="0 0 540 280" role="img" aria-label={`Curva de 55 graus no automático a 70 graus com 100 por cento. Temperatura simulada de ${temperature} graus.`}>
            <defs><linearGradient id="curve-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#95dcec" stopOpacity=".16" /><stop offset="1" stopColor="#95dcec" stopOpacity="0" /></linearGradient></defs>
            {[50, 111.67, 173.33, 235].map((y, i) => <g key={y}><line x1="48" y1={y} x2="488" y2={y} stroke="#34505c" strokeDasharray="3 6" /><text x="510" y={y + 4}>{[100, 67, 33, 0][i]}%</text></g>)}
            <path d="M48 235L136 235L224 179.5L312 105.5L400 50L488 50V235H48Z" fill="url(#curve-fill)" /><path d="M48 235L136 235L224 179.5L312 105.5L400 50L488 50" className={!enabled ? "curve-path disabled" : "curve-path"} />
            {points.map(p => <g key={p.t}><circle cx={48 + (p.t - 50) / 25 * 440} cy={235 - p.p * 1.85} r="5" fill="#b5ebf5" stroke="#152b39" strokeWidth="3" /><text x={48 + (p.t - 50) / 25 * 440} y="266" textAnchor="middle">{p.t}°</text></g>)}
            <line x1={cx} y1={cy} x2={cx} y2="235" stroke="#b5ebf5" strokeOpacity=".45" /><circle cx={cx} cy={cy} r="7" fill="#d7f7fd" stroke="#152b39" strokeWidth="4" />
          </svg>
          <label className="temperature-slider" htmlFor="simulated-temperature"><span>Experimente a temperatura</span><output htmlFor="simulated-temperature">{temperature} °C</output><input id="simulated-temperature" type="range" min="50" max="75" step="1" value={temperature} onChange={e => setTemperature(Number(e.target.value))} /></label>
        </> : <div className="mode-illustration"><div className="illustration-mark"><Mark spinning /></div><strong>{mode === "cycle" ? "60° − 6° = 54°" : "No máximo. Até você parar."}</strong><span>{mode === "cycle" ? "Aviso − queda desejada = temperatura alvo" : "As duas ventoinhas trabalham juntas"}</span></div>}
        <div className="mode-explanation"><strong>{data.label}</strong><p>{data.text}</p><small>{data.detail}</small></div><span className="sample-label">Demonstração ilustrativa</span>
      </div>
    </div>
  </section>;
}
