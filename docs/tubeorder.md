# TubeOrder no ALLM4

- Página: `/tubeorder/`, com assets próprios em `public/tubeorder/` e CSS com prefixo `to-`, limitado a `.tubeorder-site`.
- O catálogo `lib/extensions.ts` alimenta a seção Extensões, a órbita e o rodapé. A distribuição angular permanece automática.
- O código do produto está em https://github.com/Benfic4rthur/TubeOrder.
- O GitHub Pages é estático. A consulta de Releases ocorre no navegador, sem tokens nem endpoints de backend adicionados ao site.
- `lib/tubeorder.ts` valida a última release estável e seu pacote (`tubeorder-VERSÃO.zip` ou `tubeorder.zip`). Versão, bytes e URL pertencem ao mesmo objeto validado.
- Há consulta ao abrir a página, ao retornar à aba e a cada cinco minutos enquanto visível. Um clique normal em baixar consulta novamente antes de iniciar o download. Se falhar, o destino é `https://github.com/Benfic4rthur/TubeOrder/releases/latest`, sem ZIP antigo embutido.
- As demonstrações são ilustrativas: ordenar e clicar em Não apagar não acessa playlists reais.

## Validação local

```sh
node --experimental-strip-types --test tests/*.test.mjs
npx tsc --noEmit
npm run build:static
python3 -m http.server 5194 --bind 127.0.0.1 --directory out
```

## Publicação solicitada pelo proprietário

Primeiro revisar localmente. Somente depois de o usuário pedir a publicação: criar e enviar um commit com `[skip actions]` e acionar **uma única vez** o workflow existente `Deploy Allm4 site to GitHub Pages`. Não disparar execuções intermediárias. Acompanhar essa execução e confirmar o endereço público quando terminar.
