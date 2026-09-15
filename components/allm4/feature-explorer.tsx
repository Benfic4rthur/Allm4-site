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
      <div className="explorer-screenshot">
        <AppScreenshot full />
        <span className="image-caption">
          <span className="status-dot" /> INTERFACE REAL DO ALLM4
        </span>
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
