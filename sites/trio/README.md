# Trio no ALLM4

Fonte portátil da página em `/trio/`, com documentos estáticos em português, inglês (`/trio/en/`) e espanhol (`/trio/es/`). O visual e a demonstração vêm do site independente aprovado do Trio. As demonstrações controlam apenas elementos da página.

Na raiz do ALLM4:

```sh
npm run build:trio
npm run test:trio
npm run dev
```

`npm run dev`, `npm run build` e `npm run build:static` também geram esta página pelo pipeline `build-translations.mjs` → `build-trio.mjs`. O script gera `sites/trio/dist/` e copia seu conteúdo para `public/trio/`. Os dois diretórios são derivados e ignorados pelo Git. Nenhum caminho para outro checkout ou diretório pessoal é usado pelo build.

`content.mjs` contém os textos PT/EN/ES; `index.template.html`, `styles.css` e `src/site.js` mantêm a experiência do produto. O seletor próprio usa `allm4.language.v1`, o mesmo identificador do ALLM4, com suporte a `?lang=pt|en|es` e preferência inicial do navegador. Uma rota explícita de idioma permanece compartilhável. O pipeline não injeta a barra de idiomas standalone nesta página.

O ícone oficial está em `public/assets/trio-icon.png`. As fontes Geist têm a licença em `public/fonts/LICENSE.txt`. O motor ScrollCraft em `public/vendor/` é uma cópia imutável do usado pelo site independente; o build não o transforma nem altera o motor compartilhado do ALLM4. A capa `public/share.png` mede 1200×630 e reutiliza o ícone; seu gerador opcional AppKit está em `scripts/generate-share.swift`. O PNG já está versionado, sem exigir macOS/Swift no build do site.

## Download e atualização

`distribution/` contém o pacote real do Trio, seu SHA-256 e `release.json`. O build recusa arquivos cujo tamanho, checksum e metadados não coincidam. Para atualizar o fallback incluído no ALLM4, substitua esses três arquivos pelos publicados no repositório oficial do Trio e execute os testes e `npm run build:static` novamente. Não recrie nem re-assine o aplicativo neste repositório.

O navegador consulta primeiro a última GitHub Release estável com o pacote Universal esperado. Se não houver uma Release, consulta a distribuição pública do [repositório oficial do Trio](https://github.com/Benfic4rthur/Trio/tree/main/distribution). Se ambas falharem, oferece o pacote local validado sob `/trio/downloads/`. A versão exibida e o destino do download vêm da mesma resposta. Nenhum token ou credencial é enviado, e URLs fora dos caminhos oficiais são recusadas.

O pacote atual não é notarizado. O site explica a instalação e o uso da opção **Abrir Mesmo Assim** do macOS, sem desativar proteções. macOS 13+ é o alvo de compilação; os testes reais ocorreram em Apple Silicon. A compilação Intel não equivale a um teste em hardware Intel. A compatibilidade de janelas, Spaces e múltiplos monitores tem limites descritos no projeto Trio.

A integração está preparada para revisão local. Executar o build não publica nem implanta o ALLM4.
