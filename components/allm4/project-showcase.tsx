import { FileCode2, FolderGit2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { AppScreenshot } from "./ui";
import { DemoImageModal } from "./demo-image-modal";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ProjectShowcase() {
  return (
    <section className="section project-section" id="projetos" aria-labelledby="projects-title">
      <div className="wrap project-layout">
        <div className="project-copy reveal">
          <div className="eyebrow">MAIS QUE RESPONDER. FAZER JUNTO.</div>
          <h2 id="projects-title">Sua ideia merece<br /><span className="muted-heading">sair do papel.</span></h2>
          <p className="section-intro">Em Projetos, a IA trabalha ao seu lado nos arquivos reais. Peça uma página, investigue um erro ou evolua um sistema. O Allm4 ajuda a planejar e executar as mudanças, com a sua revisão.</p>
          <div className="example-request"><span>EXEMPLO DE PEDIDO</span><p>“Crie uma página para minha cafeteria, com cardápio, horário de atendimento e um botão para o WhatsApp.”</p></div>
          <ul className="project-benefits">
            <li><FileCode2 size={19} aria-hidden="true" /><span><strong>Da conversa aos arquivos.</strong>Criação e edição de código, correções, sites, sistemas e apps.</span></li>
            <li><FolderGit2 size={19} aria-hidden="true" /><span><strong>Continue de onde parou.</strong>Organização, explicações, documentação e integração com Git e GitHub.</span></li>
            <li><ShieldCheck size={19} aria-hidden="true" /><span><strong>A decisão continua sendo sua.</strong>Aceite as mudanças, peça ajustes ou descarte antes de seguir.</span></li>
          </ul>
          <p className="fine-print">O alcance depende do projeto, da IA escolhida e do computador. Isso não dispensa revisão do código nem garante que qualquer sistema será criado sozinho.</p>
          <a className="text-button" href="#download">Experimentar em um projeto <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="project-proof reveal">
          <figure className="project-concept">
            <DemoImageModal
              src={`${publicBasePath}/images/allm4-cafeteria-site-ilustrativo.avif`}
              alt="Exemplo ilustrativo de um site de cafeteria, criado fora do Allm4 para representar o tipo de resultado visual de um projeto"
              triggerClassName="project-concept-trigger"
              label="EXEMPLO ILUSTRATIVO"
              description="Conceito visual criado fora do Allm4. Não é uma captura de um site funcional produzido pelo aplicativo."
            >
              <img
                src={`${publicBasePath}/images/allm4-cafeteria-site-ilustrativo.avif`}
                alt="Conceito visual de um site para cafeteria com apresentação, navegação e cardápio"
                width={1280}
                height={853}
                loading="lazy"
              />
            </DemoImageModal>
            <figcaption>
              <span className="concept-label">EXEMPLO ILUSTRATIVO</span>
              <strong>Uma referência visual para o tipo de projeto que você pode construir.</strong>
              <span>Esta imagem foi criada fora do Allm4 apenas para representar a ideia. Não é apresentada como resultado real do aplicativo.</span>
            </figcaption>
          </figure>
          <details className="real-proof-details"><summary>Ver a tela real de trabalho nos arquivos</summary>
            <AppScreenshot full src="/images/allm4-projeto-arquivos-v0134.png" width={3456} height={2024} maskWindowCorners alt="Tela real do Allm4 mostrando os arquivos encontrados dentro de um projeto" />
            <p>Esta captura é real e mostra o Allm4 trabalhando nos arquivos do projeto.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
