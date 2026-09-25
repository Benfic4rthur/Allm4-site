import { FileCode2, FolderGit2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { AppScreenshot } from "./ui";
import { MediaPlaceholder } from "./site-story";

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
          <MediaPlaceholder title="uma página criada pelo Allm4 funcionando no navegador" description="Usar o resultado real do pedido da cafeteria: página aberta, cardápio, horários e botão de WhatsApp. Mostrar o resultado, e não apenas a lista de arquivos." />
          <details className="real-proof-details"><summary>Ver a tela real de trabalho nos arquivos</summary>
            <AppScreenshot full src="/images/allm4-projeto-arquivos-v0134.png" width={3456} height={2024} maskWindowCorners alt="Tela real do Allm4 mostrando os arquivos encontrados dentro de um projeto" />
            <p>Captura real disponível. O resultado final acima ainda precisa ser registrado.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
