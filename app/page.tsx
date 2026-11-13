"use client";
import { localizeTree, useSiteLanguage } from "@/lib/i18n/runtime";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-mark";
import { BrandOrbit } from "@/components/brand/brand-orbit";
import { ProductArtwork } from "@/components/brand/product-artwork";
import { StudioAbout } from "@/components/brand/studio-about";
import { StudioFooter } from "@/components/brand/studio-footer";
import { StudioExtensions } from "@/components/brand/studio-extensions";
import { products } from "@/lib/products";
import "./umbrella.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  useSiteLanguage();
  return localizeTree((
    <div className="umbrella-site" id="inicio">
      <a className="umb-skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="studio-header">
        <div className="studio-shell studio-header-inner">
          <BrandLockup />
          <nav className="studio-main-nav" aria-label="Navegação principal">
            <a href="#produtos">Aplicativos</a>
            <a className="studio-nav-extensions" href="#extensoes">Extensões</a>
            <a className="studio-nav-about" href="#sobre">Sobre Arthur</a>
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <section className="studio-hero studio-shell" aria-labelledby="hero-title">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow"><span /> ALLM4 · SOFTWARE STUDIO</p>
            <h1 id="hero-title">Software para uma <span>vida mais simples.</span></h1>
            <p className="studio-intro">
              Sou Arthur Benfica, desenvolvedor full stack e criador do ALLM4.
              Aqui estão os aplicativos e extensões que crio e mantenho,
              da ideia à publicação.
            </p>
            <nav className="studio-hero-links" aria-label="Sobre e perfis de Arthur Benfica">
              <a className="studio-about-button" href="#sobre">
                Sobre Arthur <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a className="studio-hero-profile" href="https://github.com/Benfic4rthur" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Arthur Benfica (abre em nova aba)">
                GitHub <ArrowUpRight size={12} aria-hidden="true" />
              </a>
              <a className="studio-hero-profile" href="https://www.linkedin.com/in/benfic4rthur" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Arthur Benfica (abre em nova aba)">
                LinkedIn <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </nav>
            <div className="studio-hero-meta" aria-label="Áreas de atuação">
              <span>Aplicativos</span><span>Extensões</span><span>Experiências de software</span>
            </div>
          </div>
          <BrandOrbit />
        </section>
        <section className="studio-products studio-shell" id="produtos" aria-labelledby="products-title">
          <div className="studio-section-heading">
            <div className="studio-title-group">
              <h2 id="products-title" tabIndex={-1}>Produtos autorais<span>.</span></h2>
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
                    <span className="studio-availability">{product.status}</span>
                    <span className="studio-product-cta">Conhecer app <ArrowRight size={14} aria-hidden="true" /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
        <StudioExtensions />
        <StudioAbout />
      </main>
      <StudioFooter />
    </div>
  ));
}
