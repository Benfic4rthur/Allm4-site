# ALLM4 Site

Site institucional da ALLM4, marca responsável por aplicativos e experiências de software.

A home preserva o texto institucional e o símbolo grande da ALLM4 na abertura, com os aplicativos orbitando ao redor. O botão abaixo do logo reúne os ícones, faz o símbolo encolher em direção ao botão e conduz à vitrine em uma transição animada. O catálogo usa uma grade de dois por dois no desktop, seguido pelo Sobre e um rodapé escuro nas proporções da versão original. O Sobre apresenta o estúdio independente, conduzido por um único desenvolvedor, e seus princípios de utilidade, clareza e cuidado nos detalhes. Todos os produtos abrem em novas abas, sem distinguir visualmente destinos internos e externos.

## Desenvolvimento

Requer **Node.js 22.13+** e npm.

```sh
npm run install:ci
npm run dev
```

O servidor local normalmente fica disponível em `http://localhost:5173`.

Validações úteis:

```sh
npx tsc --noEmit
npm run lint
node --experimental-strip-types --test tests/releases.test.mjs
npm run build
```

O projeto usa React 19, TypeScript, Next.js 16, Vinext/Vite e Tailwind CSS 4. A versão pública é exportada como site estático e publicada no GitHub Pages.

## Estrutura principal

- `app/page.tsx`: composição da home institucional.
- `app/umbrella.css`: apresentação visual específica da nova home da marca.
- `app/globals.css`: estilos globais e infraestrutura visual legada compartilhada pelo projeto.
- `components/brand/brand-mark.tsx`: símbolo e assinatura reutilizáveis da ALLM4.
- `components/brand/brand-orbit.tsx`: órbita responsiva, reação ao mouse e sequência de entrada na vitrine; respeita movimento reduzido e transfere o foco para o catálogo.
- `components/brand/product-artwork.tsx`: visuais dos quatro produtos com ícones oficiais, capturas existentes e ilustrações de interface.
- `components/brand/studio-about.tsx`: seção institucional escura, com a história do estúdio independente, o símbolo da marca e os três princípios; destino dos links Sobre.
- `components/brand/studio-footer.tsx`: faixa de assinatura e rodapé com produtos e contato, nas proporções da versão original e com o fundo escuro da nova identidade.
- `lib/products.ts`: catálogo centralizado de aplicativos.
- `lib/site-config.ts`: links, contato e dados do produto já publicado.
- `public/brand/allm4-mark.svg`: símbolo oficial usado pela nova apresentação.
- `components/allm4/`: componentes da apresentação anterior do aplicativo, preservados para referência e reaproveitamento técnico.
- `tests/`: validações existentes do projeto.

## Catálogo de produtos

Os aplicativos exibidos na home ficam centralizados em `lib/products.ts`, nesta ordem:

1. Notchficator, com destino para `https://notchficator.app`.
2. LUM4, com destino para `https://lum4.app`.
3. JáCopiei?, com destino para a subpágina interna `/jacopiei`.
4. ALLM4 Local IA, com destino para a subpágina interna `/local-ia`.

As plataformas e os requisitos de cada aplicativo aparecem no próprio cartão, incluindo macOS e a versão para Windows do ALLM4 Local IA.

Cada entrada pode conter:

- `name`
- `slug`
- `description`
- `icon`
- `screenshot`
- `platforms`
- `status`
- `url`
- `ctaLabel`

Adicionar um novo produto não exige duplicar a estrutura da página.

O antigo site dedicado ao aplicativo de IA local foi preservado em `app/local-ia/page.tsx`, mantendo a apresentação anterior como página própria do produto em vez de descartá-la durante a mudança institucional.

`public/jacopiei/` contém o site completo publicado pelo repositório `JACOPIEI-SITE`. Ele é servido diretamente em `/jacopiei/`, com seu HTML e CSS originais, preservando a demonstração, o visual e a consulta do manifesto público de `JaCopiei-Releases`. Quando o site original mudar, execute `npm run sync:jacopiei -- /caminho/para/JACOPIEI-SITE`; o script copia `dist/` e ajusta as URLs públicas. O site não processa pagamentos nem recebe arquivos do usuário; a contratação ocorre dentro do aplicativo.

Os assets oficiais usados nos cartões de Notchficator e LUM4 foram reaproveitados dos respectivos sites oficiais, sem recriar seus ícones.

## Identidade

A nova home não recria o símbolo da ALLM4. O asset em `public/brand/allm4-mark.svg` reutiliza o símbolo oficial fornecido como referência para este redesign.

A interface usa uma base escura, tipografia limpa, amplo espaço visual e acentos azul, violeta e lilás derivados da identidade atual. Movimentos e transições são sutis e respeitam `prefers-reduced-motion`.

A abertura ocupa pelo menos a primeira tela inteira, mantendo a vitrine abaixo da dobra até a rolagem. O símbolo central fica reto e estável; seu hover aplica apenas escala e brilho. A inclinação acompanha somente os aplicativos ao redor, e a sequência do botão continua reunindo a composição antes de entrar na vitrine.

O botão de entrada na vitrine recebe um brilho suave e um movimento curto na seta a cada nove segundos. Ao passar o mouse ou focar pelo teclado, o botão ganha brilho e os aplicativos se aproximam ligeiramente do símbolo. Os efeitos respeitam movimento reduzido; a rolagem e o acesso ao Sobre continuam livres.

O Sobre ocupa no mínimo uma janela inteira e sua âncora se alinha ao topo, mantendo a vitrine e o rodapé fora do enquadramento de chegada. Título, parágrafos e princípios têm tipografia mais ampla; em telas pequenas, a seção cresce com o conteúdo, sem cortes.

## Produto existente

A implementação anterior continha uma página extensa dedicada ao aplicativo de IA local, com demonstrações, downloads, FAQs e dados de release. Os componentes e a infraestrutura técnica continuam no repositório, mas deixaram de compor a home institucional.

O catálogo atual reutiliza apenas informações já existentes no projeto: descrição do aplicativo, plataformas, ícone, captura de tela e link de releases.

## Segurança

O site público continua estático e não recebe credenciais, formulários de autenticação ou dados de sessão. A política de conteúdo existente continua aplicada em produção.

Os avisos bem-humorados no console e os bloqueios de atalhos de inspeção e do menu de contexto são apenas barreiras de conveniência, não protegem o código público nem constituem uma medida de segurança; campos editáveis, links, seleção de texto e o menu de contexto pelo teclado continuam disponíveis.

Relatos de vulnerabilidade devem seguir o arquivo `SECURITY.md` ou `/.well-known/security.txt`.

## Acessibilidade e responsividade

- navegação por teclado e link para pular ao conteúdo;
- estados de foco preservados;
- layout responsivo para desktop, tablet e celular;
- movimentos reduzidos quando `prefers-reduced-motion` está ativo;
- conteúdo e hierarquia sem dependência de efeitos visuais para compreensão.

## Publicação

O site continua hospedado no GitHub Pages, com o domínio `allm4.com`. Para evitar execuções desnecessárias, valide as mudanças localmente e envie os commits ao GitHub com `[skip actions]`. Quando a versão estiver pronta, acione uma única vez o workflow existente **Deploy Allm4 site to GitHub Pages** por `workflow_dispatch`, usando a branch `main`.

### Exportação para publicação manual, sem GitHub Actions

O site completo da ALLM4, incluindo `/local-ia/` e `/jacopiei/`, pode ser gerado localmente para hospedagem estática:

```sh
npm ci
npm run build:static
```

O comando gera o site em `out/` e confere a presença da home, das páginas internas e dos arquivos essenciais do JáCopiei. Esses arquivos podem ser enviados diretamente a uma hospedagem estática, sem conectar o repositório Git nem usar artefatos intermediários do GitHub Actions.

Como alternativa, `netlify.toml` define `npm run build:static` e `out` para envio manual na Netlify. Após o login e vínculo inicial, `netlify deploy --dir=out` envia uma prévia e `netlify deploy --dir=out --prod` publica a versão validada.

O script `npm run build` existente pertence ao ambiente de desenvolvimento Vinext. Use `build:static` para gerar o pacote de hospedagem.
