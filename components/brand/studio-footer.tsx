import { ArrowUpRight, Mail } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-mark";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import "./studio-footer.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const githubUrl = "https://github.com/Benfic4rthur";

export function StudioFooter() {
  return (
    <footer className="studio-site-footer">
      <section
        className="studio-signature-band"
        aria-labelledby="studio-signature-title"
      >
        <div className="studio-shell studio-signature-inner">
          <div>
            <h2 id="studio-signature-title">Produtos diferentes. A mesma assinatura.</h2>
            <p>
              Um aplicativo pode ter seu próprio nome. O compromisso por trás
              dele continua sendo ALLM4.
            </p>
          </div>
          <BrandLockup compact />
        </div>
      </section>

      <div className="studio-shell studio-footer-columns">
        <div className="studio-footer-brand">
          <BrandLockup />
          <p>
            Aplicativos e experiências de software pensados para serem úteis,
            claros e bem construídos.
          </p>
        </div>

        <nav className="studio-footer-column" aria-label="Produtos">
          <h3>PRODUTOS</h3>
          {products.map((product) => (
            <a
              key={product.slug}
              href={product.url.startsWith("/") ? `${publicBasePath}${product.url}` : product.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} (abre em nova aba)`}
            >
              {product.name} <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          ))}
        </nav>

        <nav className="studio-footer-column" aria-label="ALLM4">
          <h3>ALLM4</h3>
          <a href="#sobre">Sobre</a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRight size={11} aria-hidden="true" />
          </a>
          <a href={`mailto:${siteConfig.contactEmail}`}>
            Contato <Mail size={12} aria-hidden="true" />
          </a>
        </nav>
      </div>

      <div className="studio-shell studio-footer-legal">
        <span>© {new Date().getFullYear()} ALLM4. Todos os direitos reservados.</span>
        <span>Software for a brighter day</span>
        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
