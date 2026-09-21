"use client";
import { useState } from "react";
import {
  Cpu,
  MemoryStick,
  CircuitBoard,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { AppScreenshot } from "./ui";

const assistantSteps = [
  {
    id: "inicio",
    label: "1. Comece",
    src: "/images/allm4-assistente-inicio.avif",
    alt: "Tutorial do Allm4 explicando o que é uma LLM e oferecendo a análise do computador",
  },
  {
    id: "analise",
    label: "2. Análise",
    src: "/images/allm4-assistente-analise.avif",
    alt: "Allm4 mostrando a análise do processador, memória e GPU do computador",
  },
  {
    id: "recomendacao",
    label: "3. Escolha",
    src: "/images/allm4-assistente-recomendacao.avif",
    alt: "Allm4 recomendando modelos locais compatíveis com o computador",
  },
];
export function ModelAssistant() {
  return (
    <section className="section assistant-section" id="assistente">
      <div className="wrap assistant-layout">
        <div className="assistant-copy reveal">
          <div className="eyebrow">04 / FEITO PARA O SEU COMPUTADOR</div>
          <h2>
            O Allm4 ajuda
            <br />
            você a escolher.
          </h2>
          <p className="section-intro">
            Processador, memória, GPU… você não precisa entender nada disso para
            começar. O tutorial explica o básico, analisa sua máquina e mostra
            modelos adequados para você escolher com segurança.
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
        <div className="assistant-console assistant-real reveal">
          <Tabs defaultValue="recomendacao">
            <TabsList className="assistant-step-list" aria-label="Etapas do assistente de escolha">
              {assistantSteps.map((step) => (
                <TabsTrigger className="assistant-step-tab" key={step.id} value={step.id}>
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {assistantSteps.map((step) => (
              <TabsContent value={step.id} key={step.id} className="assistant-step-panel">
                <AppScreenshot full src={step.src} alt={step.alt} />
              </TabsContent>
            ))}
          </Tabs>
          <p className="demo-disclaimer">Telas reais do assistente de primeiros passos do Allm4.</p>
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
