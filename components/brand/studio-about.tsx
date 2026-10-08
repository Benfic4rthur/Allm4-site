import { BrandMark } from "@/components/brand/brand-mark";
import "./studio-about.css";

const principles = [
  {
    title: "Útil primeiro.",
    description: "Um produto precisa resolver algo de verdade antes de tentar impressionar.",
  },
  {
    title: "Clareza na experiência.",
    description: "Menos atrito, menos camadas desnecessárias e caminhos mais fáceis de entender.",
  },
  {
    title: "Cuidado nos detalhes.",
    description: "Interface, desempenho e comportamento fazem parte do mesmo produto.",
  },
];

export function StudioAbout() {
  return (
    <section className="studio-about studio-shell" id="sobre" aria-labelledby="studio-about-title" tabIndex={-1}>
      <div className="studio-about-intro">
        <div className="studio-about-copy">
          <p className="studio-eyebrow"><span /> SOBRE A ALLM4</p>
          <h2 id="studio-about-title">Software útil, simples <span>e bem construído.</span></h2>
          <p>
            A ALLM4 é um estúdio independente de software, criado e tocado por
            um único desenvolvedor. Da ideia à interface, do código à evolução
            de cada aplicativo, o trabalho passa pelas mesmas mãos.
          </p>
          <p>
            Os projetos nascem de problemas reais e de uma ideia simples:
            a tecnologia deve facilitar a rotina. Cada produto pode seguir
            seu próprio caminho. A base continua a mesma: utilidade, clareza
            e cuidado nos detalhes.
          </p>
        </div>
        <div className="studio-about-signature">
          <div className="studio-about-emblem">
            <BrandMark className="studio-about-mark" decorative />
          </div>
          <strong>ALLM4</strong>
          <span>Estúdio independente</span>
        </div>
      </div>
      <div className="studio-about-principles">
        {principles.map((principle, index) => (
          <div className="studio-about-principle" key={principle.title}>
            <span className="studio-about-number" aria-hidden="true">0{index + 1}</span>
            <div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
