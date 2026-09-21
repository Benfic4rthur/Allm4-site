import {
  BellRing,
  CheckCircle2,
  HardDrive,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function TrustRepair() {
  return (
    <section className="section trust-repair-section" id="privacidade">
      <div className="wrap">
        <div className="trust-repair-heading reveal">
          <div>
            <div className="eyebrow">05 / PRIVACIDADE, SEGURANÇA E CONFIANÇA</div>
            <h2>
              Seu ambiente é local.
              <br />
              <span className="muted-heading">O cuidado continua.</span>
            </h2>
          </div>
          <p className="section-intro">
            Controle sobre seus dados durante o uso e um caminho claro quando uma
            falha interna precisa de atenção.
          </p>
        </div>

        <div className="trust-repair-grid">
          <article className="local-trust-card reveal">
            <div className="trust-card-icon"><LockKeyhole /></div>
            <span className="trust-card-kicker">PROCESSAMENTO LOCAL</span>
            <h3>Algumas coisas não precisam sair do seu computador.</h3>
            <p>
              Modelos executados localmente podem processar conversas, imagens e
              arquivos no próprio dispositivo. Você escolhe os modelos e mantém o
              controle sobre seu ambiente.
            </p>
            <div className="trust-points">
              <span><HardDrive size={14} /> Processamento no dispositivo</span>
              <span><ShieldCheck size={14} /> Ações sensíveis confirmadas</span>
              <span><CheckCircle2 size={14} /> Alterações podem ser descartadas</span>
            </div>
            <small>
              Downloads, atualizações e outros serviços podem precisar de internet.
              A privacidade também depende dos modelos e recursos utilizados.
            </small>
          </article>

          <article className="repair-card reveal" id="allm4-repair">
            <div className="repair-card-head">
              <div className="trust-card-icon repair-icon"><Wrench /></div>
              <span><span className="status-dot" /> ATIVO E SILENCIOSO</span>
            </div>
            <span className="trust-card-kicker">ALLM4 REPAIR</span>
            <h3>Problemas que não ficam esquecidos.</h3>
            <p>
              Se algo falhar, você não precisa investigar. O Allm4 Repair encontra o
              bug, envia um relato técnico sem seus dados pessoais e prepara a
              correção. A equipe do Allm4 só revisa e autoriza quando ela está pronta
              para virar uma nova versão.
            </p>
            <figure className="repair-screenshot">
              <img
                src={`${publicBasePath}/images/allm4-repair-v2.avif`}
                alt="Janela do Allm4 Maintainer mostrando uma correção concluída e aguardando autorização"
                width="1951"
                height="1205"
                loading="lazy"
              />
            </figure>
            <div className="repair-flow" aria-label="Fluxo do Allm4 Repair">
              <div><ScanSearch size={16} /><span>Encontra<strong>Identifica o bug em silêncio</strong></span></div>
              <i />
              <div><ShieldCheck size={16} /><span>Reporta<strong>Sem senhas, tokens ou dados pessoais</strong></span></div>
              <i />
              <div><Wrench size={16} /><span>Corrige<strong>A correção é criada e testada</strong></span></div>
              <i />
              <div><BellRing size={16} /><span>Atualiza<strong>A equipe autoriza a nova versão</strong></span></div>
            </div>
            <div className="repair-control"><CheckCircle2 size={18} /><span>Ele fica sempre ativo, sem interromper o que você está fazendo.</span></div>
            <small>
              O agente cuida apenas de falhas internas reais do Allm4. Problemas de
              internet, ações canceladas e situações normais não viram relatos de bug.
            </small>
          </article>
        </div>
      </div>
    </section>
  );
}
