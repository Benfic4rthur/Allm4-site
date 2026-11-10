import Image from "next/image";
import { ArrowRight, ArrowUpRight, Ban, Check, Clock3, Play, ShieldCheck } from "lucide-react";
import { extensions } from "@/lib/extensions";
import "./studio-extensions.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function TubeOrderArtwork({ icon }: { icon: string }) {
  return <><div className="studio-tubeorder-browser"><div className="studio-extension-browser-bar"><span><i/><i/><i/></span><span>Assistir mais tarde</span><Clock3 size={11}/></div><div className="studio-tubeorder-copy"><p>Seu tempo,<br/><em>na ordem certa.</em></p><span className="studio-tubeorder-rule"><Image src={`${publicBasePath}${icon}`} alt="" width={17} height={17} unoptimized/> Curtos primeiro <Check size={10}/></span><div className="studio-tubeorder-queue">{[["Uma ideia para hoje", "4:12"], ["Entre montanhas e estrelas", "7:48"], ["Lugares para descobrir", "12:36"]].map(([title,time],index)=><div key={title}><small>{index+1}</small><span className={`studio-tubeorder-thumb studio-tubeorder-thumb--${index}`}><Play size={9}/></span><span>{title}</span><b>{time}</b></div>)}</div></div></div><span className="studio-extension-badge studio-tubeorder-badge"><Image src={`${publicBasePath}${icon}`} alt="" width={25} height={25} unoptimized/><span>A fila segue o seu ritmo.<small>TubeOrder · Ordem salva no YouTube</small></span><i/></span></>;
}

export function StudioExtensions() {
  return (
    <section
      className="studio-extensions studio-shell"
      id="extensoes"
      aria-labelledby="extensions-title"
    >
      <div className="studio-section-heading">
        <div className="studio-title-group">
          <h2 id="extensions-title" tabIndex={-1}>Extensões para o seu navegador<span>.</span></h2>
          <span className="studio-count">{String(extensions.length).padStart(2, "0")}</span>
        </div>
        <span className="studio-catalog-note">Mais controle. Do seu jeito.</span>
      </div>
      <div className="studio-extension-grid">
        {extensions.map((extension) => (
          <article
            className={`studio-product studio-extension-card studio-extension-card--${extension.slug}`}
            key={extension.slug}
          >
            <a
              className="studio-product-link studio-extension-link"
              href={`${publicBasePath}${extension.url}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Conhecer ${extension.name} (abre em nova aba)`}
            >
              <div className="studio-product-copy">
                <div className="studio-product-heading">
                  <Image
                    className="studio-product-icon"
                    src={`${publicBasePath}${extension.icon}`}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div>
                    <h3>{extension.name}</h3>
                    <p className="studio-platforms">{extension.platforms.join(" · ")}</p>
                  </div>
                  <span className="studio-product-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
                </div>
                <p className="studio-product-description">{extension.description}</p>
                <span className="studio-extension-trust"><ShieldCheck size={13} aria-hidden="true" /> Código disponível no GitHub</span>
              </div>
              <div className="studio-extension-art" aria-hidden="true">
                {extension.slug === "tubeorder" ? <TubeOrderArtwork icon={extension.icon}/> : <>
                <div className="studio-extension-browser">
                  <div className="studio-extension-browser-bar"><span><i /><i /><i /></span><span>seu YouTube</span><ShieldCheck size={10} /></div>
                  <div className="studio-extension-browser-body">
                    <p>Menos ruído.<br /><em>Mais do que importa.</em></p>
                    <div className="studio-extension-video"><span className="studio-extension-thumbnail" /><span><strong>Mais do que você gosta.</strong><small>Um canal que você escolheu</small></span><Check size={12} /></div>
                    <div className="studio-extension-filtered"><Ban size={14} /><span>Canal indesejado</span><small>Bloqueado</small></div>
                  </div>
                </div>
                <span className="studio-extension-badge"><Image src={`${publicBasePath}${extension.icon}`} alt="" width={25} height={25} unoptimized /><span>O controle fica com você.<small>CanalNonGrato · Filtro ativo</small></span><i /></span>
                </>}
              </div>
              <div className="studio-product-footer">
                <span className="studio-availability">{extension.status} · Instalação manual</span>
                <span className="studio-product-cta">{extension.ctaLabel} <ArrowRight size={14} aria-hidden="true" /></span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
