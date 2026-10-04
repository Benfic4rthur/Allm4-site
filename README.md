# ALLM4 Site

Site institucional da ALLM4, marca responsável por aplicativos e experiências de software.

A home apresenta a marca como um estúdio de software, mantém os produtos em um catálogo centralizado e usa os materiais oficiais da identidade visual disponíveis no projeto.

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
- `lib/products.ts`: catálogo centralizado de aplicativos.
- `lib/site-config.ts`: links, contato e dados do produto já publicado.
- `public/brand/allm4-mark.svg`: símbolo oficial usado pela nova apresentação.
- `components/allm4/`: componentes da apresentação anterior do aplicativo, preservados para referência e reaproveitamento técnico.
- `tests/`: validações existentes do projeto.

## Catálogo de produtos

Os aplicativos exibidos na home ficam centralizados em `lib/products.ts`, nesta ordem:

1. Notchficator, com destino para `https://notchficator.app`.
2. LUM4, com destino para `https://lum4.app`.
3. ALLM4 Local IA, com destino para a subpágina interna `/local-ia`.

A comunicação institucional deixa explícito que o foco principal da ALLM4 é desenvolver aplicações para macOS, sem impedir versões para Windows quando fizer sentido para cada produto.

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

Os assets oficiais usados nos cartões de Notchficator e LUM4 foram reaproveitados dos respectivos sites oficiais, sem recriar seus ícones.

## Identidade

A nova home não recria o símbolo da ALLM4. O asset em `public/brand/allm4-mark.svg` reutiliza o símbolo oficial fornecido como referência para este redesign.

A interface usa uma base escura, tipografia limpa, amplo espaço visual e acentos azul, violeta e lilás derivados da identidade atual. Movimentos e transições são sutis e respeitam `prefers-reduced-motion`.

## Produto existente

A implementação anterior continha uma página extensa dedicada ao aplicativo de IA local, com demonstrações, downloads, FAQs e dados de release. Os componentes e a infraestrutura técnica continuam no repositório, mas deixaram de compor a home institucional.

O catálogo atual reutiliza apenas informações já existentes no projeto: descrição do aplicativo, plataformas, ícone, captura de tela e link de releases.

## Segurança

O site público continua estático e não recebe credenciais, formulários de autenticação ou dados de sessão. A política de conteúdo existente continua aplicada em produção.

Relatos de vulnerabilidade devem seguir o arquivo `SECURITY.md` ou `/.well-known/security.txt`.

## Acessibilidade e responsividade

- navegação por teclado e link para pular ao conteúdo;
- estados de foco preservados;
- layout responsivo para desktop, tablet e celular;
- movimentos reduzidos quando `prefers-reduced-motion` está ativo;
- conteúdo e hierarquia sem dependência de efeitos visuais para compreensão.

## Publicação

O workflow de GitHub Pages continua publicando somente alterações da branch `main`. Branches de redesign podem ser validadas sem alterar a versão pública até que sejam revisadas e integradas manualmente.
