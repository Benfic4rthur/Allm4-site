# Allm4 — Site

Site comercial do Allm4, um aplicativo desktop para executar modelos de inteligência artificial localmente.

## Desenvolvimento

Requer **Node.js 22.13+** e npm.

```sh
npm run install:ci
npm run dev
```

Abra a URL exibida pelo servidor, normalmente `http://localhost:5173`.

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/releases.test.mjs
npm run build
npm start
```

O projeto usa **React 19, TypeScript, APIs do Next.js App Router, Vinext/Vite e Tailwind CSS 4**. O build incluído gera um Worker compatível com Cloudflare. A publicação via Sites é configurada em `.openai/hosting.json`. Não há dependência de banco de dados ou de chaves de API para a página.

## Estrutura

- `app/page.tsx`: composição das seções e conteúdo principal.
- `app/globals.css`: identidade visual, responsividade e animações.
- `components/allm4/`: componentes do produto, demonstrações, downloads e rodapé.
- `components/ui/`: componentes acessíveis do catálogo Shadcn/Radix.
- `lib/site-config.ts`: CTAs, contato, links legais e release de reserva.
- `public/images/allm4-app.png`: screenshot real fornecida pelo responsável pelo produto.
- `tests/releases.test.mjs`: validação de dados externos usados nos downloads.

## Downloads

Os botões apontam diretamente para os instaladores oficiais do [Allm4-Releases](https://github.com/Benfic4rthur/Allm4-Releases). A página consulta a API pública do GitHub para atualizar versão e links. Se houver erro, limite de requisições ou timeout, mantém os links verificados da versão **0.1.12**, sem chamá-la de versão mais recente.

Quando um release tiver apenas um dos instaladores, a outra plataforma recebe um link para consultar as opções no release. Não há download automático: o visitante precisa clicar.

## Personalização comercial

Edite `siteConfig.cta` em `lib/site-config.ts` para trocar texto e destino dos CTAs. Isso permite introduzir compra de licença, planos ou outro fluxo comercial quando definido. Nenhum preço ou plano fictício foi incluído.

E-mail e WhatsApp também ficam centralizados nesse arquivo.

## Conteúdo jurídico

Preencha `privacyUrl` e `termsUrl` com os documentos oficiais quando disponíveis. Atualmente, os botões abrem avisos transparentes sobre a indisponibilidade dos documentos e oferecem contato com o responsável. Os avisos não substituem uma política ou termos oficiais.

## Acessibilidade e demonstrações

- Navegação por teclado, link para pular ao conteúdo, tabs e diálogos com primitivas acessíveis.
- Layout adaptado a desktop, tablet e celular.
- `prefers-reduced-motion` respeitado; conteúdo permanece disponível sem animações.
- Demonstrações de configuração não alteram o aplicativo instalado.
- Perfis de modelos são ilustrativos. O site não executa IA nem analisa o hardware do visitante.
- A documentação introdutória aponta para a documentação em PDF incluída no aplicativo.
