"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  FolderGit2,
  History,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  MousePointer2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppScreenshot } from "./ui";

const environments = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    title: "Utilize IAs modernas sem precisar fazer um curso.",
    description:
      "Escreva, fale ou anexe documentos. O Allm4 organiza as conversas e deixa o modelo pronto para você continuar de onde parou.",
    points: [
      "Modelos locais prontos para conversar",
      "Documentos, anexos e entrada por voz",
      "Histórico persistente e preferências por modelo",
    ],
    cta: "Baixar e começar",
    link: "#download",
  },
  {
    id: "imagem",
    label: "Imagem",
    icon: ImageIcon,
    title: "Descreva a ideia. Veja ela ganhar forma.",
    description:
      "Gere imagens, explore variações e preserve prompts e resultados em um ambiente próprio, com modelos escolhidos separadamente.",
    points: [
      "Geração e variações de imagens",
      "Conversas e históricos próprios",
      "Prompt por texto ou voz",
    ],
    cta: "Conhecer o ambiente",
    link: "#projetos",
  },
  {
    id: "projetos",
    label: "Projetos",
    icon: FolderGit2,
    title: "Um par de desenvolvimento dentro do seu projeto.",
    description:
      "O Allm4 explora a base, planeja, cria, corrige, explica e documenta. Ele trabalha nos arquivos reais e ajuda até onde o modelo e o seu computador permitem.",
    points: [
      "Sites, sistemas, apps e outros projetos de software",
      "Código, correções, documentação e organização",
      "Revisão antes de aceitar, ajustar ou descartar",
      "Integração completa com o Git e o GitHub, com histórico de alterações e commits",
    ],
    cta: "Ver Projetos com Allm4",
    link: "#projetos",
  },
];

function ChatVisual() {
  return (
    <div className="explorer-motion-idle">
      <div className="explorer-screenshot">
        <AppScreenshot
          full
          src="/images/allm4-chat-em-uso-v0133.png"
          width={3456}
          height={2020}
          maskWindowCorners
          alt="Interface real do Allm4 durante uma conversa com um modelo local"
        />
        <span className="image-caption">
          <span className="status-dot" /> AMBIENTE DE CHAT DO ALLM4
        </span>
      </div>
    </div>
  );
}

function ImageVisual() {
  return (
    <div className="explorer-motion-idle">
      <div className="explorer-screenshot">
        <AppScreenshot
          full
          src="/images/allm4-imagem-em-uso-v0133.png"
          width={3456}
          height={2024}
          maskWindowCorners
          alt="Interface real do Allm4 mostrando uma imagem criada localmente"
        />
        <span className="image-caption">
          <span className="status-dot" /> AMBIENTE DE IMAGEM DO ALLM4
        </span>
      </div>
    </div>
  );
}

function ProjectsVisual() {
  return (
    <div className="explorer-motion-idle">
      <div className="explorer-screenshot">
        <AppScreenshot
          full
          src="/images/allm4-projeto-em-uso-v0133.png"
          width={3456}
          height={2022}
          maskWindowCorners
          alt="Interface real do Allm4 trabalhando em um projeto e listando seus arquivos"
        />
        <span className="image-caption">
          <span className="status-dot" /> AMBIENTE DE PROJETOS DO ALLM4
        </span>
      </div>
    </div>
  );
}

function FeatureVisual({ id }: { id: string }) {
  if (id === "chat") return <ChatVisual />;
  if (id === "imagem") return <ImageVisual />;
  return <ProjectsVisual />;
}

export function FeatureExplorer() {
  const [active, setActive] = useState("chat");

  return (
    <section className="section explore-section wrap reveal" id="recursos">
      <div className="section-heading">
        <div>
          <div className="eyebrow">01 / ESCOLHA O QUE QUER FAZER</div>
          <h2>
            Três ambientes.
            <br />
            <span className="muted-heading">Nenhuma complicação.</span>
          </h2>
        </div>
        <p className="section-intro">
          Entre em Chat, Imagem ou Projetos. Cada ambiente mostra apenas o que você
          precisa para começar, sem terminal, comandos ou configurações difíceis.
        </p>
      </div>

      <Tabs value={active} onValueChange={setActive} className="feature-tabs">
        <TabsList className="feature-tab-list" aria-label="Ambientes do Allm4">
          {environments.map((environment) => (
            <TabsTrigger
              className="feature-tab environment-tab"
              key={environment.id}
              value={environment.id}
            >
              <environment.icon size={16} />
              <span>{environment.label}</span>
            </TabsTrigger>
          ))}
          <div className="feature-tab-guide" aria-hidden="true">
            <MousePointer2 size={13} />
            <span>Escolha um ambiente para explorar</span>
          </div>
        </TabsList>

        {environments.map((environment, index) => (
          <TabsContent
            key={environment.id}
            value={environment.id}
            className="feature-panel"
          >
            <div className="feature-preview"><FeatureVisual id={environment.id} /></div>
            <div className="feature-description">
              <div className="feature-number">
                0{index + 1} <span>/ {environment.label.toUpperCase()}</span>
              </div>
              <h3>{environment.title}</h3>
              <p>{environment.description}</p>
              <ul>
                {environment.points.map((point) => (
                  <li key={point}><Check size={14} />{point}</li>
                ))}
              </ul>
              <a className="text-button" href={environment.link}>
                {environment.cta}<ArrowUpRight size={15} />
              </a>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="environment-benefits" aria-label="Benefícios disponíveis nos ambientes">
        <div>
          <Mic size={17} />
          <span><strong>Fale em vez de digitar.</strong>Use sua voz em Chat, Imagem e Projetos.</span>
        </div>
        <div>
          <History size={17} />
          <span><strong>Continue exatamente de onde parou.</strong>Conversas, resultados e projetos preservam seu contexto.</span>
        </div>
      </div>
    </section>
  );
}
