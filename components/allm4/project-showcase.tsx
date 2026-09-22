import { FileCode2, FolderGit2, ShieldCheck } from "lucide-react";
import { AppScreenshot } from "./ui";

export function ProjectShowcase() {
  return (
    <section className="section project-section" id="projetos">
      <div className="wrap project-layout">
        <div className="project-copy reveal">
          <div className="eyebrow">03 / PROJETOS COM ALLM4</div>
          <h2>
            Seu par de desenvolvimento.
            <br />
            <span className="muted-heading">Do plano aos arquivos.</span>
          </h2>
          <p className="section-intro">
            Abra a pasta e converse com o Allm4 como conversaria com alguém trabalhando
            ao seu lado. Ele entende a estrutura e ajuda a planejar, construir,
            investigar problemas e evoluir o projeto.
          </p>
          <ul className="project-benefits">
            <li><FileCode2 size={17} /><span><strong>Constrói e mantém</strong>Ajuda com sites, sistemas, apps, recursos novos, correções e melhorias.</span></li>
            <li><FolderGit2 size={17} /><span><strong>Entende e organiza</strong>Explora arquivos, explica o código, prepara documentação e mantém o contexto do projeto.</span></li>
            <li><ShieldCheck size={17} /><span><strong>Trabalha com sua revisão</strong>Mostra as mudanças para você aceitar, pedir ajustes ou descartar.</span></li>
          </ul>
          <p className="fine-print">
            O alcance depende do projeto, do modelo escolhido e do computador. Quando
            não puder executar algo com segurança, o Allm4 explica o limite e ajuda
            você a escolher o próximo passo.
          </p>
        </div>

        <div className="project-proof reveal">
          <AppScreenshot
            full
            src="/images/allm4-projeto-arquivos-v0134.png"
            width={3456}
            height={2024}
            maskWindowCorners
            alt="Tela real do Allm4 mostrando os arquivos encontrados dentro de um projeto"
          />
          <div className="project-proof-caption">
            <span><span className="status-dot" /> PROJETO REAL EM USO</span>
            <strong>Os arquivos aparecem organizados e prontos para abrir.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
