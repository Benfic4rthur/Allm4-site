import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { BrandLockup, BrandMark } from "@/components/brand/brand-mark";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import "./umbrella.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const githubUrl = "https://github.com/Benfic4rthur";

export default function Home() {
  return (
    <div className="umbrella-site" id="inicio">
      <a className="umb-skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="umb-header">
        <div className="umb-header-inner">
          <BrandLockup />

          <nav className="umb-nav" aria-label="Navegação principal">
            <a href="#produtos">Produtos</a>
            <a href="#sobre">Sobre</a>
          </nav>

          <div className="umb-header-meta">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ALLM4 no GitHub"
            >
              GitHub
            </a>
            <a className="umb-header-cta" href="#produtos">
              Ver produtos <ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <section className="umb-hero umb-shell" aria-labelledby="hero-title">
          <div className="umb-hero-copy">
            <div className="umb-kicker">ALLM4 · SOFTWARE STUDIO</div>
            <h1 id="hero-title">
              Software para uma
              <span>vida mais simples.</span>
            </h1>
            <p className="umb-hero-lede">
              A ALLM4 projeta e desenvolve software com foco em utilidade,
              clareza e cuidado nos detalhes. Ferramentas feitas para tornar a
              tecnologia mais simples de usar no dia a dia.
            </p>

            <div className="umb-hero-actions">
              <a className="umb-primary-link" href="#produtos">
                Conhecer os produtos <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a className="umb-secondary-link" href="#sobre">
                Sobre a ALLM4
              </a>
            </div>

            <div className="umb-hero-meta" aria-label="Áreas de atuação">
              <span>Aplicativos</span>
              <span>Desktop</span>
              <span>Experiências de software</span>
            </div>
          </div>

          <div className="umb-mark-stage" aria-hidden="true">
            <BrandMark className="umb-hero-mark" decorative />
            <div className="umb-stage-label">
              <strong>ALLM4</strong>
              <span>SOFTWARE FOR A BRIGHTER DAY</span>
            </div>
          </div>
        </section>

        <section
          className="umb-products umb-section"
          id="produtos"
          aria-labelledby="products-title"
        >
          <div className="umb-shell">
            <div className="umb-section-heading">
              <div>
                <div className="umb-kicker">PRODUTOS</div>
                <h2 id="products-title">Software com propósito.</h2>
              </div>
              <p>
                Cada aplicativo tem seu próprio foco, sua própria experiência e
                espaço para evoluir. Todos compartilham o mesmo cuidado de
                produto, design e desenvolvimento da ALLM4.
              </p>
            </div>

            <div className="umb-product-list">
              {products.map((product) => (
                <article className="umb-product" key={product.slug}>
                  <div className="umb-product-copy">
                    <div className="umb-product-topline">
                      <Image
                        className="umb-product-icon"
                        src={`${publicBasePath}${product.icon}`}
                        width={96}
                        height={96}
                        alt=""
                        aria-hidden="true"
                        unoptimized
                      />
                      {product.status && (
                        <span className="umb-status">{product.status}</span>
                      )}
                    </div>

                    <h3
                      className={
                        product.slug === "allm4-local-ia"
                          ? "umb-product-title-local-ia"
                          : undefined
                      }
                    >
                      {product.name}
                      <span className="umb-product-byline">by ALLM4</span>
                    </h3>
                    <p className="umb-product-description">
                      {product.description}
                    </p>

                    <div
                      className="umb-platforms"
                      aria-label="Plataformas disponíveis"
                    >
                      {product.platforms.map((platform) => (
                        <span key={platform}>{platform}</span>
                      ))}
                    </div>

                    <a
                      className="umb-product-link"
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.ctaLabel}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>

                  <div className="umb-product-visual">
                    {product.screenshot ? (
                      <Image
                        className="umb-product-screenshot"
                        src={`${publicBasePath}${product.screenshot}`}
                        width={product.screenshotWidth ?? 1200}
                        height={product.screenshotHeight ?? 630}
                        loading="lazy"
                        alt={product.screenshotAlt ?? `Interface de ${product.name}`}
                        sizes="(max-width: 980px) 100vw, 60vw"
                        unoptimized
                      />
                    ) : (
                      <BrandMark className="umb-about-mark" decorative />
                    )}
                  </div>
                </article>
              ))}
            </div>

            <p className="umb-catalog-note">
              Novos aplicativos serão adicionados a este catálogo conforme
              forem publicados.
            </p>
          </div>
        </section>

        <section className="umb-about umb-section" id="sobre" aria-labelledby="about-title">
          <div className="umb-shell">
            <div className="umb-about-grid">
              <div className="umb-about-copy">
                <div className="umb-kicker">SOBRE A ALLM4</div>
                <h2 id="about-title">Software útil, simples e bem construído.</h2>
                <p>
                  A ALLM4 é uma marca de software criada para desenvolver
                  ferramentas que resolvam problemas reais sem transformar a
                  experiência em algo mais complicado do que precisa ser.
                </p>
                <p>
                  Cada produto pode seguir um caminho próprio. A base continua
                  a mesma: clareza, utilidade e atenção ao comportamento do
                  software em cada detalhe.
                </p>
              </div>

              <div className="umb-about-signature">
                <BrandMark className="umb-about-mark" decorative />
                <strong>ALLM4</strong>
                <span>Software for a brighter day</span>
              </div>
            </div>

            <div className="umb-principles" aria-label="Princípios da ALLM4">
              <article className="umb-principle">
                <span>01</span>
                <h3>Útil primeiro.</h3>
                <p>
                  Um produto precisa resolver algo de verdade antes de tentar
                  impressionar.
                </p>
              </article>
              <article className="umb-principle">
                <span>02</span>
                <h3>Clareza na experiência.</h3>
                <p>
                  Menos atrito, menos camadas desnecessárias e caminhos mais
                  fáceis de entender.
                </p>
              </article>
              <article className="umb-principle">
                <span>03</span>
                <h3>Cuidado nos detalhes.</h3>
                <p>
                  Interface, desempenho e comportamento fazem parte do mesmo
                  produto.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="umb-brand-band" aria-label="Identidade ALLM4">
          <div className="umb-brand-band-inner">
            <div>
              <h2>Produtos diferentes. A mesma assinatura.</h2>
              <p>
                Um aplicativo pode ter seu próprio nome. O compromisso por trás
                dele continua sendo ALLM4.
              </p>
            </div>
            <BrandLockup compact />
          </div>
        </section>
      </main>

      <footer className="umb-footer">
        <div className="umb-footer-main">
          <div className="umb-footer-brand">
            <BrandLockup />
            <p>
              Aplicativos e experiências de software pensados para serem úteis,
              claros e bem construídos.
            </p>
          </div>

          <div className="umb-footer-column">
            <span>PRODUTOS</span>
            {products.map((product) => (
              <a
                key={product.slug}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.name} <ArrowUpRight size={11} aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="umb-footer-column">
            <span>ALLM4</span>
            <a href="#sobre">Sobre</a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={11} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.releases}
              target="_blank"
              rel="noopener noreferrer"
            >
              Releases <ArrowUpRight size={11} aria-hidden="true" />
            </a>
            <a href={`mailto:${siteConfig.contactEmail}`}>
              Contato <Mail size={12} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="umb-footer-bottom">
          <span>
            © {new Date().getFullYear()} ALLM4. Todos os direitos reservados.
          </span>
          <span>Software for a brighter day</span>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
      </footer>
    </div>
  );
}
