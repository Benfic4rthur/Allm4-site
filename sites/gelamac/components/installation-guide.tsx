"use client";
import { localizeTree, useSiteLanguage } from "../lib/i18n/runtime";
import { useState } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";

const command = "cd ~/Downloads/GelaMac-macOS-arm64 && /bin/zsh ./Instalar.command";
export function InstallationGuide() {
  useSiteLanguage();
  const [copied, setCopied] = useState(false), [copyError, setCopyError] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(command); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return localizeTree(<section className="installation-guide container" id="instalacao" aria-labelledby="installation-title">
    <div className="installation-heading"><h2 id="installation-title">A primeira instalação,<br /><span>passo a passo.</span></h2><p>Esta prévia é distribuída fora da App Store e ainda não tem notarização da Apple. O macOS pode pedir uma liberação manual na primeira abertura.</p></div>
    <ol className="installation-steps"><li><span>1</span><div><strong>Baixe e descompacte</strong><p>Abra o ZIP. A pasta GelaMac-macOS-arm64 contém o aplicativo, o instalador e um LEIA-ME. Antes de atualizar, encerre o GelaMac que estiver aberto.</p></div></li><li><span>2</span><div><strong>Execute o instalador</strong><p>Com a pasta extraída em Downloads, abra o Terminal e cole o comando abaixo. O script instala o app pronto em Aplicativos. Não precisa de Xcode nem de uma conta de desenvolvedor.</p></div></li><li><span>3</span><div><strong>Autorize a primeira abertura</strong><p>Se o macOS bloquear o app, tente abri-lo e vá a Ajustes do Sistema → Privacidade e Segurança. Se você confiar na cópia, use a opção Abrir Mesmo Assim, quando disponível.</p></div></li><li><span>4</span><div><strong>Aprove o auxiliar uma vez</strong><p>Ao controlar as ventoinhas, autorize o auxiliar conforme o macOS solicitar. Instalações ou atualizações podem pedir senha. As aberturas normais usam a autorização existente, sem guardar sua senha.</p></div></li></ol>
    <div className="install-command"><div><span>TERMINAL</span><button onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copiado" : "Copiar comando"}</button></div><code>{command}</code>{copyError && <small role="status">Não foi possível copiar. Selecione o comando e copie manualmente.</small>}</div>
    <div className="installation-notes"><p>Se você extrair em outra pasta, ajuste o caminho do comando. O instalador preserva a versão anterior e não desativa as proteções do macOS.</p><a href="https://support.apple.com/pt-br/102445" target="_blank" rel="noreferrer">Orientações da Apple <ArrowUpRight size={13} /></a></div>
  </section>);
}
