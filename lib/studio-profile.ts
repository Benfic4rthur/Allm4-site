export type StudioExperience = {
  company: string;
  role: string;
  period: string;
  summary: string;
};

export type StudioSkillGroup = {
  title: string;
  items: string[];
};

export type StudioProjectStory = {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  decision: string;
  technologies: string[];
  url: string;
  icon: string;
};

export const experiences: StudioExperience[] = [
  {
    company: "EloGroup Consulting",
    role: "Full Stack Developer",
    period: "mar. 2024 a set. 2026",
    summary:
      "Desenvolvimento e manutenção de soluções corporativas, com novas funcionalidades e correções. Atuação no MPCE com Sydle One, regras de negócio, tratamento de incidentes e operação assistida.",
  },
  {
    company: "Thomson Reuters",
    role: "Fiscon Analyst · Java Web",
    period: "mar. 2023 a mar. 2024",
    summary:
      "Atuação em aplicações Java Web da área fiscal, análise de incidentes e suporte fiscal e contábil no software Domínio.",
  },
  {
    company: "Parceria Sistemas",
    role: "Desenvolvedor Java Júnior",
    period: "out. 2021 a mar. 2023",
    summary:
      "Desenvolvimento e manutenção de um CRM legado em Java, com integrações de banco de dados.",
  },
  {
    company: "Tecno3 Sistemas de Informação",
    role: "Analista de Suporte Sênior",
    period: "fev. 2011 a jul. 2021",
    summary:
      "Trabalho com C#, depuração de software, gestão de suporte e ambientes Microsoft.",
  },
  {
    company: "Ícone Comercial LTDA",
    role: "Técnico de Manutenção e Desenvolvedor Web",
    period: "jan. 2010 a jan. 2011",
    summary: "Atuação em manutenção técnica e desenvolvimento web.",
  },
  {
    company: "F1 Soluções",
    role: "Desenvolvedor Web",
    period: "jan. 2008 a jan. 2009",
    summary: "Desenvolvimento web no início da trajetória profissional.",
  },
];

export const skillGroups: StudioSkillGroup[] = [
  {
    title: "Web",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Angular",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend e integrações",
    items: [
      "Node.js",
      "Express",
      "Java",
      "Spring",
      "APIs REST",
      "Autenticação",
      "Integrações",
    ],
  },
  {
    title: "Dados",
    items: [
      "PostgreSQL",
      "MySQL",
      "SQL Server",
      "SQLite",
      "MongoDB",
      "Prisma",
      "Hibernate",
      "Firebase",
      "Supabase",
    ],
  },
  {
    title: "Desktop e IA",
    items: [
      "Electron",
      "Swift",
      "SwiftUI",
      "AppKit",
      "Ollama",
      "MLX",
      "Whisper",
    ],
  },
  {
    title: "Ferramentas e entrega",
    items: [
      "Git",
      "GitHub Actions",
      "Testes automatizados",
      "Vite",
      "Maven",
      "Vercel",
    ],
  },
  {
    title: "Conhecimentos complementares",
    items: ["Python", "C#", "PHP", "Azure", "AWS", "Delphi"],
  },
];

export const selectedProjectStories: StudioProjectStory[] = [
  {
    slug: "lum4",
    name: "LUM4",
    tagline: "Brilho XDR no Mac, do aplicativo à operação de licenças.",
    problem:
      "Oferecer controle de brilho XDR/EDR em Macs compatíveis e sustentar a distribuição do produto, do período de teste à ativação de licenças.",
    decision:
      "Construir um aplicativo nativo com Swift, SwiftUI, AppKit e Metal, conectado a um backend que gerencia períodos de teste e licenças. A operação inclui ativação de dispositivos, checkout Pix com Mercado Pago, webhooks, auditoria e testes de integração.",
    technologies: [
      "Swift",
      "SwiftUI",
      "AppKit",
      "Metal",
      "Node.js",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Neon",
      "Vercel",
    ],
    url: "https://lum4.app",
    icon: "/products/lum4-icon.png",
  },
  {
    slug: "jacopiei",
    name: "JáCopiei?",
    tagline: "Comparação pelo conteúdo para saber o que ainda precisa de cópia.",
    problem:
      "Identificar quais arquivos já têm uma cópia e guardar o que falta, preservando os originais e mantendo um registro da operação.",
    decision:
      "Comparar arquivos pelo conteúdo com SHA-256 e permitir a cópia em lote. O aplicativo mantém histórico e relatórios CSV e oferece versões para Macs com Intel e Apple Silicon, usando Swift, SwiftUI, AppKit e Swift Package Manager.",
    technologies: ["Swift", "SwiftUI", "AppKit", "Swift Package Manager"],
    url: "/jacopiei/",
    icon: "/products/jacopiei-icon.svg",
  },
  {
    slug: "beira",
    name: "Beira",
    tagline: "Brilho e volume nas bordas do trackpad.",
    problem:
      "Ajustar brilho e volume por gestos nas bordas do trackpad, com cuidado para evitar acionamentos involuntários.",
    decision:
      "Construir uma experiência nativa com Swift, SwiftUI e AppKit. Uma máquina de estados organiza a leitura dos gestos e as proteções de acionamento.",
    technologies: ["Swift", "SwiftUI", "AppKit"],
    url: "/beira/",
    icon: "/products/beira-icon.svg",
  },
];
