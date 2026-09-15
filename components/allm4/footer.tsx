"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brand } from "./ui";
import { siteConfig } from "@/lib/site-config";
const information = {
  documentacao: {
    title: "Comece com o Allm4",
    description: "Um caminho simples da instalação à sua primeira conversa.",
    icon: BookOpen,
  },
  privacidade: {
    title: "Política de Privacidade",
    description: "Informações sobre privacidade e o uso do Allm4.",
    icon: ShieldCheck,
  },
  termos: {
    title: "Termos de Uso",
    description: "Informações sobre as condições de uso do Allm4.",
    icon: FileText,
  },
};
type Info = keyof typeof information;
export function Footer() {
  const [active, setActive] = useState<Info | null>(null);
  const content = active ? information[active] : null;
  return (
    <>
      <footer className="footer wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>
              Sua IA. No seu computador.
              <br />
              Sob seu controle.
            </p>
            <a
              className="contact-link"
              href={`mailto:${siteConfig.contactEmail}`}
            >
              <Mail size={12} />
              {siteConfig.contactEmail}
            </a>
            <a
              className="contact-link"
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={12} />
              WhatsApp · {siteConfig.whatsappLabel}
              <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="footer-column">
            <span>PRODUTO</span>
            <a href="#recursos">Conheça o Allm4</a>
            <a href="#assistente">Assistente de modelos</a>
            <a href="#download">
              Download <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="footer-column">
            <span>EXPLORE</span>
            <button onClick={() => setActive("documentacao")}>
              Documentação
            </button>
            <a href={siteConfig.releases} target="_blank" rel="noreferrer">
              Atualizações <ArrowUpRight size={11} />
            </a>
            <a
              href={`mailto:${siteConfig.contactEmail}?subject=Suporte%20Allm4`}
            >
              Suporte
            </a>
          </div>
          <div className="footer-column">
            <span>INFORMAÇÕES</span>
            {siteConfig.privacyUrl ? (
              <a href={siteConfig.privacyUrl}>Política de Privacidade</a>
            ) : (
              <button onClick={() => setActive("privacidade")}>
                Política de Privacidade
              </button>
            )}
            {siteConfig.termsUrl ? (
              <a href={siteConfig.termsUrl}>Termos de Uso</a>
            ) : (
              <button onClick={() => setActive("termos")}>Termos de Uso</button>
            )}
            <a href={`mailto:${siteConfig.contactEmail}`}>Contato</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Allm4. Todos os direitos reservados.
          </span>
          <span>INTELIGÊNCIA LOCAL. POSSIBILIDADES REAIS.</span>
          <a href="#inicio">Voltar ao topo ↑</a>
        </div>
      </footer>
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="info-dialog">
          {content && (
            <>
              <content.icon className="dialog-icon" size={27} />
              <DialogTitle>{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
              {active === "documentacao" ? (
                <div className="documentation">
                  <ol>
                    <li>
                      <strong>Instale o aplicativo.</strong>
                      <p>
                        Escolha o instalador para Windows ou macOS Apple Silicon
                        na área de download.
                      </p>
                    </li>
                    <li>
                      <strong>Encontre seu modelo.</strong>
                      <p>
                        Explore o catálogo ou use o assistente para receber
                        sugestões com base no processador, memória e GPU do seu
                        computador.
                      </p>
                    </li>
                    <li>
                      <strong>Baixe e converse.</strong>
                      <p>
                        Após o download do modelo, selecione-o para começar uma
                        conversa. Ajuste suas preferências nas Configurações.
                      </p>
                    </li>
                  </ol>
                  <p>
                    O aplicativo inclui documentação em PDF na área de Ajuda e
                    suporte das Configurações.
                  </p>
                  <a
                    className="text-button"
                    href={siteConfig.releases}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar notas oficiais de versão{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              ) : (
                <div className="documentation">
                  <p>
                    {active === "privacidade"
                      ? "Os modelos executados localmente podem processar suas conversas no próprio dispositivo. Downloads de modelos, atualizações e outros serviços podem precisar de conexão e estão sujeitos às práticas dos respectivos provedores."
                      : "O uso do aplicativo e dos modelos pode estar sujeito a condições e licenças próprias. Consulte as informações do modelo escolhido e do release antes de utilizar o Allm4."}
                  </p>
                  <p>
                    {active === "privacidade"
                      ? "A política oficial completa ainda não foi publicada neste site."
                      : "Os termos oficiais completos ainda não foram publicados neste site."}{" "}
                    Para solicitar o documento ou esclarecer dúvidas, entre em
                    contato com o responsável.
                  </p>
                  <a
                    className="button"
                    href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(content.title + " — Allm4")}`}
                  >
                    Entrar em contato <Mail size={15} />
                  </a>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
