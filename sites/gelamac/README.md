# GelaMac dentro da ALLM4

Página original do GelaMac, preservada como documento HTML independente em `/gelamac/`, sem iframe. Isso isola completamente CSS, fontes, animações e scripts dos demais produtos. O repositório do aplicativo e o site de origem não são modificados por esta integração.

`npm run build:static` na raiz compila primeiro esta página com as dependências já instaladas na ALLM4. `scripts/build-gelamac.mjs` exporta em `public/gelamac/`; o build principal inclui esse diretório em `out/gelamac/`, como já ocorre com o JáCopiei. Os diretórios gerados são ignorados pelo Git.

Todos os recursos locais, inclusive os chunks Next, ficam sob `/gelamac/`. Metadados, canonical e compartilhamento apontam para `https://allm4.com/gelamac/`.

GitHub Pages não executa a antiga rota de servidor `/api/release`. A mesma consulta, filtros, versão, URL estável e fallback do site original foram preservados em `lib/release-config.ts` e executam no navegador, usando a API pública do GitHub. O download continua em `Benfic4rthur/GelaMac/releases/latest/download/GelaMac-macOS-arm64.zip`; indisponibilidade da API usa a cópia revisada do pacote local em `/gelamac/downloads/`.

A home, a órbita e o rodapé usam o registro de aplicativo em `lib/products.ts`. A distribuição angular permanece calculada pelo total de produtos; não há ângulos fixos adicionados.

Publicação: somente após solicitação do usuário, commit com `[skip actions]` e um único disparo manual do workflow existente `Deploy Allm4 site to GitHub Pages`. A integração local não publica nem dispara workflows.
