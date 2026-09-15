"use client";
import { useState } from "react";
import {
  Zap,
  Sparkles,
  Layers,
  Cpu,
  MemoryStick,
  CircuitBoard,
  Check,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
const profiles = [
  {
    id: "rapido",
    label: "Mais rápido",
    icon: Zap,
    title: "Mais leve. Mais ágil.",
    description:
      "Prioriza modelos mais leves, que exigem menos recursos. Um ponto de partida para conversas e tarefas do dia a dia.",
    bars: [28, 25, 38],
    note: "PRIORIDADE: AGILIDADE",
  },
  {
    id: "recomendado",
    label: "Recomendado",
    icon: Sparkles,
    title: "O equilíbrio faz a diferença.",
    description:
      "Busca uma combinação entre capacidade e desempenho, considerando os recursos disponíveis no seu computador.",
    bars: [60, 55, 64],
    note: "PRIORIDADE: EQUILÍBRIO",
  },
  {
    id: "capaz",
    label: "Mais capaz",
    icon: Layers,
    title: "Mais espaço para ir além.",
    description:
      "Prioriza modelos com maior capacidade entre as opções adequadas ao seu hardware, que podem exigir mais memória e tempo de resposta.",
    bars: [86, 90, 88],
    note: "PRIORIDADE: CAPACIDADE",
  },
];
export function ModelAssistant() {
  return (
    <section className="section assistant-section" id="assistente">
      <div className="wrap assistant-layout">
        <div className="assistant-copy reveal">
          <div className="eyebrow">03 / FEITO PARA O SEU COMPUTADOR</div>
          <h2>
            O modelo certo.
            <br />
            Para o que você tem.
          </h2>
          <p className="section-intro">
            Não precisa entender de parâmetros para começar. O assistente do
            Allm4 conhece seu hardware e ajuda você a fazer uma boa escolha.
          </p>
          <div className="hardware-list">
            <div>
              <Cpu />
              <span>
                Processador<small>A base do processamento</small>
              </span>
            </div>
            <div>
              <MemoryStick />
              <span>
                Memória<small>Espaço para seus modelos</small>
              </span>
            </div>
            <div>
              <CircuitBoard />
              <span>
                GPU<small>Capacidade de aceleração</small>
              </span>
            </div>
          </div>
          <p className="fine-print">
            Computadores diferentes, possibilidades diferentes.
            <br />O desempenho depende do hardware e do modelo escolhido.
          </p>
        </div>
        <div className="assistant-console reveal">
          <div className="console-top">
            <span>
              <Cpu size={16} /> ASSISTENTE ALLM4
            </span>
            <span>EXPLORE OS PERFIS</span>
          </div>
          <div className="hardware-diagram" aria-hidden="true">
            <span className="hardware-node">
              <Cpu />
            </span>
            <i />
            <span className="center-node">
              <Sparkles />
            </span>
            <i />
            <span className="hardware-node">
              <MemoryStick />
            </span>
          </div>
          <Tabs defaultValue="recomendado">
            <TabsList
              className="profile-list"
              aria-label="Perfil de recomendação"
            >
              {profiles.map((p) => (
                <TabsTrigger className="profile-tab" key={p.id} value={p.id}>
                  <p.icon size={14} />
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {profiles.map((p) => (
              <TabsContent value={p.id} key={p.id} className="profile-panel">
                <div className="profile-heading">
                  <p.icon size={22} />
                  <span>{p.note}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="profile-bars" aria-hidden="true">
                  {p.bars.map((b, i) => (
                    <div key={i}>
                      <span>
                        {["CAPACIDADE", "USO DE MEMÓRIA", "COMPLEXIDADE"][i]}
                      </span>
                      <div>
                        <i style={{ width: `${b}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="profile-note">
                  <Check size={13} /> A recomendação real é feita dentro do
                  aplicativo.
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <p className="demo-disclaimer">
            Perfis ilustrativos • Este site não analisa seu computador.
          </p>
        </div>
      </div>
    </section>
  );
}
export function ModelControls() {
  const [temperature, setTemperature] = useState([0.7]);
  const [context, setContext] = useState([8192]);
  const [topP, setTopP] = useState([0.9]);
  const [seed, setSeed] = useState("42");
  const reset = () => {
    setTemperature([0.7]);
    setContext([8192]);
    setTopP([0.9]);
    setSeed("42");
  };
  return (
    <section className="section wrap controls-layout" id="controle">
      <div className="controls-console reveal">
        <div className="console-top">
          <span>
            <SlidersHorizontal size={16} /> INTERFACE DA LLM
          </span>
          <span className="small-pill">POR MODELO</span>
        </div>
        <div className="control-row">
          <label id="temperature-label">
            Temperatura <span>{temperature[0].toFixed(1)}</span>
          </label>
          <Slider
            ref={(node) => {
              node
                ?.querySelector('[role="slider"]')
                ?.setAttribute("aria-labelledby", "temperature-label");
            }}
            aria-labelledby="temperature-label"
            value={temperature}
            min={0}
            max={2}
            step={0.1}
            onValueChange={setTemperature}
          />
          <div className="slider-labels">
            <span>Mais previsível</span>
            <span>Mais variado</span>
          </div>
        </div>
        <div className="control-row">
          <label id="context-label">
            Contexto <span>{context[0].toLocaleString("pt-BR")} tokens</span>
          </label>
          <Slider
            ref={(node) => {
              node
                ?.querySelector('[role="slider"]')
                ?.setAttribute("aria-labelledby", "context-label");
            }}
            aria-labelledby="context-label"
            value={context}
            min={2048}
            max={32768}
            step={2048}
            onValueChange={setContext}
          />
          <div className="slider-labels">
            <span>Menos memória</span>
            <span>Mais contexto</span>
          </div>
        </div>
        <div className="control-row">
          <label id="top-p-label">
            Top P <span>{topP[0].toFixed(2)}</span>
          </label>
          <Slider
            ref={(node) => {
              node
                ?.querySelector('[role="slider"]')
                ?.setAttribute("aria-labelledby", "top-p-label");
            }}
            aria-labelledby="top-p-label"
            value={topP}
            min={0.05}
            max={1}
            step={0.05}
            onValueChange={setTopP}
          />
        </div>
        <div className="seed-row">
          <label htmlFor="seed">
            Seed<span>Referência para a aleatoriedade</span>
          </label>
          <input
            id="seed"
            inputMode="numeric"
            type="number"
            min="0"
            max="2147483647"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>
        <div className="controls-footer">
          <span>Demonstração interativa</span>
          <button
            onClick={reset}
            aria-label="Restaurar valores da demonstração"
          >
            <RotateCcw size={12} /> Restaurar
          </button>
        </div>
      </div>
      <div className="controls-copy reveal">
        <div className="eyebrow">04 / LIBERDADE PARA AJUSTAR</div>
        <h2>
          Seus modelos.
          <br />
          <span className="muted-heading">Suas regras.</span>
        </h2>
        <p className="section-intro">
          Simples quando você quer. Ajustável quando precisa. Encontre o
          comportamento ideal para cada modelo, com configurações salvas
          individualmente.
        </p>
        <p className="section-intro">
          Explore temperatura, contexto e outros controles avançados. Do
          primeiro chat aos ajustes mais precisos, o ambiente acompanha você.
        </p>
        <div className="parameter-tags">
          <span>Keep Alive</span>
          <span>Top K</span>
          <span>Min P</span>
          <span>Repeat Penalty</span>
          <span>Máximo da resposta</span>
        </div>
        <span className="interaction-hint">
          <SlidersHorizontal size={13} /> Experimente os controles ao lado.
        </span>
      </div>
    </section>
  );
}
