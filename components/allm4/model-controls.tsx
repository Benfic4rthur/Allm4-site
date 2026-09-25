"use client";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  ScanSearch,
  CheckCircle2,
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
    src: "/images/allm4-assistente-inicio-v0134.png",
    width: 3454,
    height: 2020,
    alt: "Tutorial do Allm4 explicando o que é uma LLM e oferecendo a análise do computador",
  },
  {
    id: "analise",
    label: "2. Análise",
    src: "/images/allm4-assistente-analise-v0134.png",
    width: 3456,
    height: 2018,
    alt: "Allm4 mostrando a análise do processador, memória e GPU do computador",
  },
  {
    id: "recomendacao",
    label: "3. Escolha",
    src: "/images/allm4-assistente-escolha-v0134.png",
    width: 3456,
    height: 2024,
    alt: "Allm4 recomendando modelos locais compatíveis com o computador",
  },
];
export function ModelAssistant() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(assistantSteps[0].id);
  const [imageOpen, setImageOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setActiveStep(assistantSteps[0].id);
    }, { threshold: 0.2 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || imageOpen) return;

    const timer = window.setTimeout(() => {
      setActiveStep((current) => {
        const index = assistantSteps.findIndex((step) => step.id === current);
        return assistantSteps[(index + 1) % assistantSteps.length].id;
      });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeStep, imageOpen, visible]);

  return (
    <section ref={sectionRef} className="section assistant-section" id="assistente">
      <div className="wrap assistant-layout">
        <div className="assistant-copy reveal">
          <div className="eyebrow">PRIMEIROS PASSOS, SEM ADIVINHAÇÃO</div>
          <h2>
            Instale o Allm4.
            <br />
            <span className="muted-heading">Ele te guia no resto.</span>
          </h2>
          <p className="section-intro">
            Você não precisa pesquisar dezenas de IAs nem descobrir como configurar
            cada uma. O assistente analisa seu computador, recomenda opções
            compatíveis e te acompanha na escolha e no download.
          </p>
          <ol className="starting-steps">
            <li><span className="starting-step-icon"><Download size={20} aria-hidden="true" /></span><div><strong>1. Baixe e abra o Allm4.</strong><p>Escolha o instalador para Windows ou Mac.</p></div></li>
            <li><span className="starting-step-icon"><ScanSearch size={20} aria-hidden="true" /></span><div><strong>2. Deixe ele conhecer seu computador.</strong><p>O assistente analisa a máquina e indica IAs adequadas.</p></div></li>
            <li><span className="starting-step-icon"><CheckCircle2 size={20} aria-hidden="true" /></span><div><strong>3. Escolha sua IA e comece.</strong><p>Baixe pelo aplicativo e siga as orientações para usar.</p></div></li>
          </ol>
          <a className="text-button" href="#download">Ver download e instalação ↓</a>
          <p className="fine-print">
            Computadores diferentes, possibilidades diferentes.
            <br />O desempenho depende do hardware e do modelo escolhido.
          </p>
        </div>
        <div className="assistant-console assistant-real reveal">
          <Tabs value={activeStep} onValueChange={setActiveStep}>
            <TabsList className="assistant-step-list" aria-label="Etapas do assistente de escolha">
              {assistantSteps.map((step) => (
                <TabsTrigger className="assistant-step-tab" key={step.id} value={step.id}>
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {assistantSteps.map((step, index) => (
              <TabsContent value={step.id} key={step.id} className="assistant-step-panel">
                <AppScreenshot
                  full
                  src={step.src}
                  alt={step.alt}
                  width={step.width}
                  height={step.height}
                  maskWindowCorners
                  gallery={assistantSteps.map((item) => ({
                    src: item.src,
                    alt: item.alt,
                  }))}
                  initialIndex={index}
                  onModalOpenChange={setImageOpen}
                />
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
