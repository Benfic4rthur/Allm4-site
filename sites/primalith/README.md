# Primalith dentro do ALLM4

`source/` é uma cópia dos arquivos estáticos preparados em `/Users/arthurbenfica/Projetos/Primalith-site/dist`. Não contém código do jogo. O projeto original permanece independente e não é alterado pela integração.

Para receber uma nova exportação revisada:

```sh
npm run sync:primalith -- /Users/arthurbenfica/Projetos/Primalith-site/dist
```

O desenvolvimento e `npm run build:static` exportam essa cópia para `public/games/primalith/`, por meio de `scripts/build-translations.mjs` e `scripts/build-primalith.mjs`. A publicação é reproduzível sem depender de outra pasta no computador.

O HTML permanece um documento separado, sem o CSS ou os componentes React do ALLM4. Imagens, vídeos, fontes, ícone, estilos originais, parser de releases e snapshot são preservados. Caminhos relativos, inclusive `import.meta.url`, resolvem dentro de `/games/primalith/`.

O adaptador acrescenta os metadados da rota, o retorno para Games e os controles PT/EN/ES no cabeçalho nativo, visíveis também no celular. As traduções usam o catálogo e a preferência compartilhados do ALLM4. O único ajuste no script original mantém a linha de macOS escondida até existir um instalador validado; Windows já segue essa regra. O fallback oficial e a distinção entre consulta ao vivo, cache e snapshot continuam funcionando.

Preservar as licenças locais em `source/assets/licenses/`. As fotografias e os vídeos são capturas reais do jogo fornecidas pelo projeto Primalith-site.
