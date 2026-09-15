"use client";
import { useState } from "react";
import {
  MessageSquare,
  Boxes,
  SlidersHorizontal,
  Cpu,
  FileText,
  Check,
  ArrowUpRight,
  Sparkles,
  Download,
  Search,
  MousePointer2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppScreenshot } from "./ui";
const features = [
  {
    id: "conversa",
    label: "Conversa",
    icon: MessageSquare,
    title: "Um espaço para pensar em voz alta.",
    description:
      "Escreva, explore ideias e converse com o modelo que você escolheu. Seu histórico fica organizado para continuar de onde parou.",
    points: [
      "Chat com modelos locais",
      "Histórico de conversas",
      "Seleção de modelo por conversa",
    ],
    link: "#download",
    cta: "Comece uma conversa",
  },
  {
    id: "modelos",
    label: "Modelos",
    icon: Boxes,
    title: "Uma IA para cada jeito de pensar.",
    description:
      "Explore o catálogo, encontre modelos compatíveis e gerencie seus downloads em um só lugar. Mude de modelo quando sua tarefa pedir.",
    points: [
      "Catálogo com busca e filtros",
      "Download pela interface",
      "Gerenciamento dos modelos instalados",
    ],
    link: "#assistente",
    cta: "Encontre seu modelo",
  },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: SlidersHorizontal,
    title: "Uma experiência do seu jeito.",
    description:
      "Defina idioma, estilo de resposta e nível de detalhe. Adicione instruções personalizadas e ajuste cada modelo individualmente.",
    points: [
      "Preferências pessoais",
      "Instruções personalizadas",
      "Parâmetros salvos por modelo",
    ],
    link: "#controle",
    cta: "Explore os controles",
  },
  {
    id: "assistente",
    label: "Assistente",
    icon: Cpu,
    title: "Seu computador tem potencial.",
    description:
      "O assistente analisa processador, memória e GPU para sugerir modelos adequados ao seu computador. Você escolhe o equilíbrio que prefere.",
    points: [
      "Análise do hardware",
      "Sugestões por capacidade",
      "Escolha orientada, sem adivinhação",
    ],
    link: "#assistente",
    cta: "Conheça o assistente",
  },
  {
    id: "documentos",
    label: "Documentos",
    icon: FileText,
    title: "Mais contexto. Mais possibilidades.",
    description:
      "Traga documentos para a conversa e dê mais contexto ao modelo. Use o Allm4 para explorar o conteúdo com a IA que você escolheu.",
    points: [
      "Suporte a documentos",
      "Contexto para suas conversas",
      "Processamento com modelos locais",
    ],
    link: "#download",
    cta: "Leve suas ideias adiante",
  },
];
function FeatureVisual({ id }: { id: string }) {
  if (id === "conversa")
    return (
      <div className="explorer-motion-idle">
        <div className="explorer-screenshot">
          <AppScreenshot full />
          <span className="image-caption">
            <span className="status-dot" /> INTERFACE REAL DO ALLM4
          </span>
        </div>
      </div>
    );
  return (
    <div className={`feature-visual visual-${id}`}>
      <div className="demo-top">
        <Sparkles size={16} />
        <span>
          ALLM4 / {features.find((f) => f.id === id)?.label.toUpperCase()}
        </span>
        <span className="status-dot" />
      </div>
      {id === "modelos" && (
        <>
          <div className="visual-search">
            <Search size={14} /> Encontre seu próximo modelo
          </div>
          <div className="catalog-item">
            <div className="mini-icon">
              <Boxes />
            </div>
            <div>
              <strong>Seu modelo atual</strong>
              <span>Pronto para conversar</span>
            </div>
            <span className="small-pill">
              <Check size={11} /> Instalado
            </span>
          </div>
          <div className="catalog-item">
            <div className="mini-icon">
              <Cpu />
            </div>
            <div>
              <strong>Explore novas possibilidades</strong>
              <span>Modelos compatíveis no catálogo</span>
            </div>
            <Download size={16} />
          </div>
          <div className="visual-bottom">
            ESCOLHA UM MODELO. ABRA UMA POSSIBILIDADE.
          </div>
        </>
      )}
      {id === "configuracoes" && (
        <>
          <div className="preference-row">
            <span>Idioma</span>
            <strong>Português</strong>
          </div>
          <div className="preference-row">
            <span>Estilo de resposta</span>
            <strong>Direto e claro</strong>
          </div>
          <div className="preference-row">
            <span>Nível de detalhe</span>
            <strong>Equilibrado</strong>
          </div>
          <div className="instruction">
            <span>INSTRUÇÕES PERSONALIZADAS</span>
            <p>
              Explique com exemplos práticos e me ajude a ir além da primeira
              ideia.
            </p>
          </div>
        </>
      )}
      {id === "assistente" && (
        <>
          <div className="visual-cpu">
            <Cpu size={40} />
            <span>Vamos encontrar o seu modelo.</span>
          </div>
          <div className="hardware-tags">
            <span>Processador</span>
            <span>Memória</span>
            <span>GPU</span>
          </div>
          <div className="recommend-line">
            <Sparkles size={16} />
            <span>Um equilíbrio pensado para seu hardware.</span>
          </div>
        </>
      )}
      {id === "documentos" && (
        <>
          <div className="document-art">
            <FileText size={52} />
            <i />
            <i />
            <i />
          </div>
          <div className="document-question">
            Quais são as ideias principais deste documento?
          </div>
          <div className="document-answer">
            <Sparkles size={17} />
            <div>
              <span />
              <span />
              <span />
            </div>
          </div>
        </>
      )}
      <span className="image-caption">VISUALIZAÇÃO ILUSTRATIVA DO RECURSO</span>
    </div>
  );
}
export function FeatureExplorer() {
  const [active, setActive] = useState("conversa");
  return (
    <section className="section explore-section wrap reveal" id="recursos">
      <style>{`
        .feature-tab-guide {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
          margin: 4px 0 -5px;
          color: #77786f;
          font: 7px monospace;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          pointer-events: none;
        }
        .feature-tab-guide svg {
          color: #f67c52;
          animation: feature-guide-pulse 1.8s ease-in-out infinite;
        }
        .feature-tab {
          position: relative;
          transition: color 180ms ease, background-color 180ms ease, transform 180ms ease;
        }
        .feature-tab:hover {
          color: #d5d2c9;
          background: rgba(246, 124, 82, 0.045);
          transform: translateY(-2px);
        }
        .feature-tab[data-state="active"] {
          background: linear-gradient(to top, rgba(246, 124, 82, 0.075), transparent 72%);
        }
        .feature-tab[data-state="active"]::after {
          content: "";
          position: absolute;
          left: 18%;
          right: 18%;
          bottom: -1px;
          height: 1px;
          background: #f67c52;
          box-shadow: 0 0 12px rgba(246, 124, 82, 0.55);
        }
        .feature-preview {
          perspective: 1050px;
        }
        .explorer-motion-idle {
          width: 100%;
          animation: explorer-idle-float 4.8s ease-in-out infinite;
        }
        .explorer-screenshot {
          --parallax-light-x: 50%;
          --parallax-light-y: 50%;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 300ms cubic-bezier(.2,.8,.2,1), filter 220ms ease, box-shadow 220ms ease;
        }
        .explorer-screenshot::before {
          content: "";
          position: absolute;
          inset: 0 0 24px;
          z-index: 3;
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            circle at var(--parallax-light-x) var(--parallax-light-y),
            rgba(255, 214, 185, 0.2),
            rgba(246, 124, 82, 0.09) 28%,
            transparent 58%
          );
          mix-blend-mode: screen;
          transition: opacity 180ms ease;
        }
        .explorer-screenshot:hover::before {
          opacity: 1;
        }
        .explorer-screenshot:hover {
          filter: brightness(1.06) saturate(1.04);
          box-shadow: 0 28px 70px rgba(0, 0, 0, .26);
        }
        @keyframes explorer-idle-float {
          0%, 100% { transform: translate3d(0, 0, 0) rotateZ(0deg); }
          25% { transform: translate3d(0, -7px, 0) rotateZ(-.35deg); }
          50% { transform: translate3d(0, -12px, 0) rotateZ(0deg); }
          75% { transform: translate3d(0, -6px, 0) rotateZ(.35deg); }
        }
        @keyframes feature-guide-pulse {
          0%, 100% { transform: translateX(0); opacity: .58; }
          50% { transform: translateX(-3px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .explorer-motion-idle,
          .feature-tab-guide svg {
            animation: none !important;
          }
        }
        @media (max-width: 700px) {
          .feature-tab-guide {
            justify-content: flex-start;
            margin-bottom: -8px;
          }
        }
      `}</style>
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            02 / UM AMBIENTE. MUITAS POSSIBILIDADES.
          </div>
          <h2>
            Familiar no primeiro clique.
            <br />
            <span className="muted-heading">Seu em cada detalhe.</span>
          </h2>
        </div>
        <p className="section-intro">
          Tudo o que você precisa para ter uma IA pessoal, reunido em uma
          interface que dá vontade de usar.
        </p>
      </div>
      <Tabs value={active} onValueChange={setActive} className="feature-tabs">
        <div className="feature-tab-guide" aria-hidden="true">
          <MousePointer2 size={11} />
          <span>Selecione uma aba para explorar</span>
        </div>
        <TabsList
          className="feature-tab-list"
          aria-label="Explore os recursos do Allm4"
        >
          {features.map((f) => (
            <TabsTrigger className="feature-tab" key={f.id} value={f.id}>
              <f.icon size={16} />
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {features.map((f) => (
          <TabsContent key={f.id} value={f.id} className="feature-panel">
            <div className="feature-preview">
              <FeatureVisual id={f.id} />
            </div>
            <div className="feature-description">
              <div className="feature-number">
                0{features.indexOf(f) + 1}{" "}
                <span>/ {f.label.toUpperCase()}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <ul>
                {f.points.map((p) => (
                  <li key={p}>
                    <Check size={14} />
                    {p}
                  </li>
                ))}
              </ul>
              <a className="text-button" href={f.link}>
                {f.cta}
                <ArrowUpRight size={15} />
              </a>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
