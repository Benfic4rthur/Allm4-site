# Always Dark na ALLM4

A página existente foi integrada em `public/alwaysdarkmode/`, seguindo o padrão independente já usado pelo JáCopiei. Na exportação estática, o endereço é **https://allm4.com/alwaysdarkmode/**.

Origem: repositório [AlwaysDarkMode](https://github.com/Benfic4rthur/AlwaysDarkMode), commit `7976f5e`, diretório `site/dist`. O projeto e o site originais permanecem independentes. A cópia preserva o HTML, o CSS, os textos, os assets e a lógica da demonstração. O CSS vive em seu próprio documento e não é importado pelo layout React da ALLM4.

As adaptações são os links internos para as páginas da ALLM4, canonical, Open Graph, Twitter, favicon e a remoção do canal de recarga exclusivo do servidor de desenvolvimento original. Os caminhos dos assets permanecem relativos para funcionar dentro da subpágina. A imagem de compartilhamento vem da capa oficial.

Todos os botões continuam apontando para `https://github.com/Benfic4rthur/AlwaysDarkMode/releases/latest/download/Always-Dark.zip`. O GitHub resolve a release mais recente. O site consulta a API pública uma vez por abertura para exibir o número e o tamanho da release oficial. O HTML contém v1.0.1 como referência se a consulta falhar; o download permanente continua funcionando. Não há consulta periódica nem token. As preferências dos exemplos são apenas uma demonstração local.

O cadastro em `lib/extensions.ts` alimenta o card da home, o rodapé e a órbita. A distribuição angular continua usando o tamanho do catálogo automaticamente. A arte do card usa o ícone oficial e as cores do produto.

## Conferir localmente

```sh
node --experimental-strip-types --test tests/*.test.mjs
npm run lint
npx tsc --noEmit
npm run build:static
python3 -m http.server 4174 --bind 127.0.0.1 --directory out
```

Abra **http://127.0.0.1:4174/alwaysdarkmode/**. A prévia de `out/` reproduz a resolução de diretórios do GitHub Pages, inclusive as páginas independentes. O servidor de desenvolvimento do Next não representa essas rotas de `index.html` da mesma forma.

## Publicação

Esta integração deve ser conferida localmente antes da publicação. Quando autorizada pelo usuário: commit com `[skip actions]`, push e um único disparo manual do workflow existente **Deploy Allm4 site to GitHub Pages**, em `.github/workflows/deploy-pages.yml`. Em seguida, verificar a home, `/alwaysdarkmode/` e o download no endereço público. Não criar outro workflow.
