import { Languages, MessageSquareText, UserRound } from "lucide-react";
import { AppScreenshot } from "./ui";

export function PersonalizationShowcase() {
  return (
    <section className="section personalization-section" id="personalizacao">
      <div className="wrap personalization-layout">
        <div className="personalization-copy reveal">
          <div className="eyebrow">E AINDA FICA DO SEU JEITO</div>
          <h2>
            Você escolhe como
            <br />
            <span className="muted-heading">o Allm4 conversa.</span>
          </h2>
          <p className="section-intro">
            Defina como quer ser chamado, o idioma e o tipo de resposta que prefere.
            O Allm4 guarda essas escolhas no seu computador para você não precisar
            explicar tudo de novo em cada conversa.
          </p>
          <div className="personalization-points">
            <span><UserRound size={16} /><strong>Seu nome e sua imagem</strong></span>
            <span><Languages size={16} /><strong>Idioma que você prefere</strong></span>
            <span><MessageSquareText size={16} /><strong>Respostas curtas, detalhadas ou do seu jeito</strong></span>
          </div>
          <p className="fine-print">As preferências são salvas automaticamente neste dispositivo.</p>
        </div>

        <div className="personalization-visual reveal">
          <AppScreenshot
            full
            src="/images/allm4-personalizacao-v0134.png"
            width={3456}
            height={2020}
            maskWindowCorners
            alt="Tela real do Allm4 para personalizar nome, idioma e estilo das respostas"
          />
          <span className="image-caption">
            <span className="status-dot" /> PERSONALIZAÇÃO REAL DO USUÁRIO
          </span>
        </div>
      </div>
    </section>
  );
}
