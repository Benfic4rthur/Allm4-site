import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CreditCard,
  Database,
  KeyRound,
  MessageCircle,
  Sun,
  Volume2,
} from "lucide-react";
import {
  experiences,
  selectedProjectStories,
  skillGroups,
} from "@/lib/studio-profile";
import type {
  StudioExperience,
  StudioSkillGroup,
} from "@/lib/studio-profile";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const github = "https://github.com/Benfic4rthur";
const linkedin = "https://www.linkedin.com/in/benfic4rthur";
const whatsapp = "https://wa.me/5551991640517";

export type ProfileProjectSlug = "lum4" | "jacopiei" | "beira";

function ExternalLinkNotice() {
  return <span className="profile-sr-only"> (abre em nova aba)</span>;
}

function Experience({ experience }: { experience: StudioExperience }) {
  return (
    <li className="profile-job">
      <div className="profile-job-heading">
        <h3>{experience.company}</h3>
        <span>{experience.period}</span>
      </div>
      <p className="profile-job-role">{experience.role}</p>
      <p>{experience.summary}</p>
    </li>
  );
}

function SkillGroup({ group }: { group: StudioSkillGroup }) {
  return (
    <div className="profile-skill-group">
      <h3>{group.title}</h3>
      <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function LicenseFlow() {
  return (
    <figure className="profile-license-figure">
      <div className="profile-license-flow">
        <div className="profile-license-app">
          <div className="profile-window-bar" aria-hidden="true"><i /><i /><i /></div>
          <Image src={basePath + "/products/lum4-icon.png"} alt="" width={54} height={54} unoptimized />
          <strong>LUM4</strong>
          <span>Brilho XDR no Mac</span>
          <div className="profile-brightness" aria-hidden="true"><Sun size={15} /><span><i /></span><Sun size={21} /></div>
          <small>Swift · SwiftUI · Metal</small>
        </div>
        <div className="profile-license-connector" aria-hidden="true"><ArrowRight size={18} /></div>
        <div className="profile-license-service">
          <span className="profile-service-label">O SERVIÇO POR TRÁS</span>
          <p><KeyRound size={15} aria-hidden="true" /><span>Trial e licenças<small>Ativação de dispositivos</small></span></p>
          <p><CreditCard size={15} aria-hidden="true" /><span>Checkout Pix<small>Mercado Pago e webhooks</small></span></p>
          <p><Database size={15} aria-hidden="true" /><span>Dados e auditoria<small>PostgreSQL · Neon</small></span></p>
          <small>Node.js · TypeScript · Express</small>
        </div>
      </div>
      <figcaption>Da interface nativa aos serviços do produto. Diagrama ilustrativo da arquitetura.</figcaption>
    </figure>
  );
}

function TrackpadStory() {
  return (
    <figure className="profile-trackpad-figure">
      <div className="profile-trackpad" aria-hidden="true">
        <div className="profile-trackpad-edge profile-trackpad-edge--volume"><Volume2 size={17} /><span>↕</span></div>
        <div className="profile-trackpad-center"><span>[ ]</span><small>O ponteiro segue livre.</small></div>
        <div className="profile-trackpad-edge profile-trackpad-edge--light"><Sun size={17} /><span>↕</span></div>
      </div>
      <figcaption>O gesto começa na borda e segue na vertical. Movimentos no centro continuam com o ponteiro.</figcaption>
    </figure>
  );
}

export function ProfileIdentity() {
  return (
    <section className="profile-slide profile-hero" id="profile-identity" aria-labelledby="profile-identity-title">
      <div className="profile-hero-copy">
        <h2 id="profile-identity-title">Arthur Benfica<span>Desenvolvedor.<br />Criador de produtos.</span></h2>
        <p>Trabalho com tecnologia desde 2008 e com React desde 2020. Minha trajetória passa por sistemas corporativos, desenvolvimento web, aplicativos nativos e inteligência artificial.</p>
        <p>No ALLM4, reúno essa experiência para construir e manter meus próprios produtos, da primeira ideia à interface, ao código e à distribuição.</p>
        <div className="profile-hero-links">
          <a className="profile-button" href={whatsapp} target="_blank" rel="noopener noreferrer">
            Vamos conversar no WhatsApp <ArrowUpRight size={15} aria-hidden="true" /><ExternalLinkNotice />
          </a>
          <a className="profile-text-link" href={github} target="_blank" rel="noopener noreferrer">
            Meu GitHub <ArrowUpRight size={14} aria-hidden="true" /><ExternalLinkNotice />
          </a>
        </div>
      </div>
      <figure className="profile-portrait">
        <Image src={basePath + "/images/arthur-benfica.jpg"} alt="Retrato de Arthur Benfica" width={950} height={954} unoptimized />
        <figcaption><strong>Arthur Benfica</strong><span>Desenvolvedor Full Stack · Criador do ALLM4</span></figcaption>
      </figure>
    </section>
  );
}

export function ProfileExperience() {
  return (
    <section className="profile-slide profile-section profile-experience" id="profile-experience" aria-labelledby="profile-experience-title">
      <div className="profile-section-intro">
        <h2 id="profile-experience-title">A experiência<br />{" "}que levo para o código.</h2>
        <p>Desenvolvimento, suporte e contato com quem usa o software fazem parte da minha trajetória.</p>
      </div>
      <div>
        <div className="profile-timeline-wrap">
          <span className="profile-timeline-rule" aria-hidden="true" />
          <ol className="profile-timeline">
            {experiences.slice(0, 3).map((experience) => <Experience key={experience.company} experience={experience} />)}
          </ol>
        </div>
        <details className="profile-earlier">
          <summary>Ver experiências anteriores <ChevronDown size={16} aria-hidden="true" /></summary>
          <div className="profile-timeline-wrap">
            <span className="profile-timeline-rule" aria-hidden="true" />
            <ol className="profile-timeline" start={4}>
              {experiences.slice(3).map((experience) => <Experience key={experience.company} experience={experience} />)}
            </ol>
          </div>
        </details>
      </div>
    </section>
  );
}

export function ProfileEducation() {
  return (
    <section className="profile-slide profile-education-band" id="profile-education" aria-labelledby="profile-education-title">
      <div className="profile-section">
        <div className="profile-section-intro">
          <h2 id="profile-education-title">O que sigo<br />{" "}aprendendo.</h2>
          <p>Formação acadêmica e idiomas.</p>
        </div>
        <div className="profile-education">
          <article><span>Em andamento</span><h3>Inteligência Artificial<br />e Machine Learning</h3><p>Unifatecie Digital</p></article>
          <article><span>Em andamento</span><h3>Gestão da Tecnologia<br />da Informação</h3><p>Universidade Feevale</p></article>
          <dl className="profile-languages"><div><dt>Inglês</dt><dd>Fluente</dd></div><div><dt>Espanhol</dt><dd>Intermediário</dd></div></dl>
        </div>
      </div>
    </section>
  );
}

export function ProfileTechnologies() {
  return (
    <section className="profile-slide profile-section profile-technologies" id="profile-technologies" aria-labelledby="profile-technologies-title">
      <div className="profile-section-intro">
        <h2 id="profile-technologies-title">Linguagens<br />{" "}e ferramentas.</h2>
        <p>Da aplicação web ao software nativo, com APIs, dados e integrações de IA.</p>
      </div>
      <div className="profile-skills">
        <div className="profile-skill-grid">
          {skillGroups.slice(0, 4).map((group) => <SkillGroup key={group.title} group={group} />)}
        </div>
        <details className="profile-skill-more">
          <summary>Ferramentas de trabalho e outros conhecimentos <ChevronDown size={16} aria-hidden="true" /></summary>
          <div className="profile-skill-grid">
            {skillGroups.slice(4).map((group) => <SkillGroup key={group.title} group={group} />)}
          </div>
        </details>
      </div>
    </section>
  );
}

export function ProfileProjectStory({ slug }: { slug: ProfileProjectSlug }) {
  const project = selectedProjectStories.find((story) => story.slug === slug);

  if (!project) {
    throw new Error(`Missing studio project story: ${slug}`);
  }

  return (
    <section className={"profile-slide profile-case profile-case--" + project.slug} id={"profile-story-" + project.slug} aria-labelledby={"profile-story-" + project.slug + "-title"}>
      <div className="profile-case-copy">
        <div className="profile-case-name"><Image src={basePath + project.icon} alt="" width={38} height={38} unoptimized /><span>{project.name}</span></div>
        <h2 id={"profile-story-" + project.slug + "-title"}>{project.tagline}</h2>
        <dl className="profile-case-story">
          <div><dt>O problema</dt><dd>{project.problem}</dd></div>
          <div><dt>A decisão</dt><dd>{project.decision}</dd></div>
        </dl>
        <p className="profile-case-technologies">{project.technologies.join(" · ")}</p>
        <a className="profile-text-link" href={project.url.startsWith("/") ? basePath + project.url : project.url} target="_blank" rel="noopener noreferrer">
          Conhecer {project.name} <ArrowUpRight size={14} aria-hidden="true" /><ExternalLinkNotice />
        </a>
      </div>
      {project.slug === "lum4" ? <LicenseFlow /> : project.slug === "jacopiei" ? (
        <figure className="profile-copy-figure">
          <Image src={basePath + "/products/jacopiei-preview.png"} alt="Arte de apresentação do JáCopiei?, com uma pasta e confirmação de cópia" width={1730} height={909} unoptimized />
          <figcaption><Check size={14} aria-hidden="true" /> Verificar o conteúdo, preservar os originais.</figcaption>
        </figure>
      ) : <TrackpadStory />}
    </section>
  );
}

export function ProfileContact() {
  return (
    <section className="profile-slide profile-closing" id="profile-contact" aria-labelledby="profile-contact-title">
      <div>
        <h2 id="profile-contact-title">Vamos conversar.</h2>
        <p>Fale comigo pelo WhatsApp. No LinkedIn, minha trajetória. No GitHub, o que construo.</p>
      </div>
      <div className="profile-hero-links">
        <a className="profile-button" href={whatsapp} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={15} aria-hidden="true" /> WhatsApp <ArrowUpRight size={15} aria-hidden="true" /><ExternalLinkNotice />
        </a>
        <a className="profile-text-link" href={github} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight size={14} aria-hidden="true" /><ExternalLinkNotice />
        </a>
        <a className="profile-text-link" href={linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <ArrowUpRight size={14} aria-hidden="true" /><ExternalLinkNotice />
        </a>
      </div>
    </section>
  );
}
