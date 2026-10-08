import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-mark";
import { BrandOrbit } from "@/components/brand/brand-orbit";
import { ProductArtwork } from "@/components/brand/product-artwork";
import { StudioAbout } from "@/components/brand/studio-about";
import { StudioFooter } from "@/components/brand/studio-footer";
import { products } from "@/lib/products";
import "./umbrella.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <div className="umbrella-site" id="inicio">
      <a className="umb-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="studio-header">
        <div className="studio-shell studio-header-inner">
          <BrandLockup />
        </div>
      </header>
      <main id="conteudo">
        <section className="studio-hero studio-shell" aria-labelledby="hero-title">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow"><span /> ALLM4 · SOFTWARE STUDIO</p>
            <h1 id="hero-title">Software para uma <span>vida mais simples.</span></h1>
            <p className="studio-intro">
              A ALLM4 projeta e desenvolve software com foco em utilidade,
              clareza e cuidado nos detalhes. Ferramentas feitas para tornar a
              tecnologia mais simples de usar no dia a dia.
            </p>
            <a className="studio-about-button" href="#sobre">
              Sobre a ALLM4 <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <div className="studio-hero-meta" aria-label="Áreas de atuação">
              <span>Aplicativos</span><span>Desktop</span><span>Experiências de software</span>
            </div>
          </div>
          <BrandOrbit />
        </section>
        <section className="studio-products studio-shell" id="produtos" aria-labelledby="products-title">
          <div className="studio-section-heading">
            <div className="studio-title-group">
              <h2 id="products-title" tabIndex={-1}>Conheça os nossos apps<span>.</span></h2>
              <span className="studio-count">{String(products.length).padStart(2, "0")}</span>
            </div>
            <span className="studio-catalog-note">Pequenos detalhes. Uma rotina melhor.</span>
          </div>
          <div className="studio-product-grid">
            {products.map((product) => (
              <article className={`studio-product studio-product--${product.slug}`} key={product.slug} id={product.slug}>
                <a
                  className="studio-product-link"
                  href={product.url.startsWith("/") ? `${publicBasePath}${product.url}` : product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Conhecer ${product.name} (abre em nova aba)`}
                >
                  <div className="studio-product-copy">
                    <div className="studio-product-heading">
                      <Image className="studio-product-icon" src={`${publicBasePath}${product.icon}`} alt="" width={48} height={48} unoptimized />
                      <div>
                        <h3>{product.name}</h3>
                        <p className="studio-platforms">{product.platforms.join(" · ")}</p>
                      </div>
                      <span className="studio-product-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
                    </div>
                    <p className="studio-product-description">{product.description}</p>
                  </div>
                  <ProductArtwork product={product} />
                  <div className="studio-product-footer">
                    <span className="studio-availability"><i />{product.status}</span>
                    <span className="studio-product-cta">Conhecer app <ArrowRight size={14} aria-hidden="true" /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
        <StudioAbout />
      </main>
      <StudioFooter />
    </div>
  );
}
