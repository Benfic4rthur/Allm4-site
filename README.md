# Allm4 — Site

Site oficial do Allm4, aplicativo desktop para executar modelos de inteligência artificial localmente.

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
node --experimental-strip-types --test tests/releases.test.mjs
npm run build
```

O projeto usa React 19, TypeScript, Next.js, Vinext/Vite e Tailwind CSS 4. A versão pública é exportada como site estático e publicada no GitHub Pages.

## Estrutura

- `app/page.tsx`: composição das seções e conteúdo principal.
- `app/globals.css`: identidade visual, responsividade e animações.
- `components/allm4/`: componentes do produto, demonstrações, downloads e rodapé.
- `components/ui/`: componentes reutilizáveis da interface.
- `lib/site-config.ts`: CTAs, contato, links legais e release de reserva.
- `public/images/allm4-app.png`: screenshot real do aplicativo.
- `tests/releases.test.mjs`: validação dos dados externos usados nos downloads.

## Downloads

Os botões apontam somente para instaladores do repositório oficial `Allm4-Releases`. A página consulta a API pública do GitHub para localizar o release estável mais recente e valida host, caminho, estado e extensão dos arquivos antes de usar qualquer URL retornada.

Se a API estiver indisponível, o site mantém links de reserva previamente definidos. Não há download automático: o visitante precisa iniciar a ação.

## Segurança

O site público é estático e não recebe credenciais, formulários de autenticação ou dados de sessão. A versão de produção aplica uma política de conteúdo restritiva, limita conexões externas ao necessário, omite referrer, não publica source maps de navegador e executa verificações automáticas de dependências e tipos no GitHub Actions.

Relatos de vulnerabilidade devem seguir o arquivo `SECURITY.md` ou `/.well-known/security.txt`.

## Conteúdo jurídico

`privacyUrl` e `termsUrl` ficam centralizados em `lib/site-config.ts` para receber os documentos oficiais quando publicados.

## Acessibilidade

- navegação por teclado e link para pular ao conteúdo;
- componentes interativos acessíveis;
- layout responsivo para desktop, tablet e celular;
- `prefers-reduced-motion` respeitado;
- demonstrações de configuração não alteram o aplicativo instalado.
