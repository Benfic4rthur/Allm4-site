# Revisão do site: simplicidade demonstrada

Branch de teste: `feature/site-simples-demonstrativo`.
Base de produção: `e924123ddf14bdeabfb78efb3d4a5039d04d0a83`.
Não fazer merge nem publicar antes da revisão local do Arthur.

## Objetivo
Apresentar Allm4 a quem está começando com IA: benefício claro, primeiros passos guiados, resultados de Chat/Imagem/Projetos, acesso e instalação compreensíveis. Mantém a identidade escura/laranja e os componentes existentes.

## O que mudou
- Apresentação com tela real, uso inicial gratuito e três entradas visíveis para os recursos.
- Assistente de escolha logo no começo, traduzindo hardware em passos e mantendo a galeria real.
- Demonstrações dedicadas de imagens e projetos com exemplos de pedidos identificados como exemplos.
- Marcadores visuais explicitamente reservados para resultados ainda não registrados. Nenhum resultado foi fabricado.
- Ícone da marca usa o PNG oficial já existente, sem redesenho.
- Acesso e condições sempre visíveis; instalação normal vem antes da ajuda para bloqueios.
- Perguntas frequentes, links corretos e tipografia maior em telas pequenas.

## Conteúdos que faltam
1. Resultado real da imagem da cafeteria criada pelo Allm4 a partir do pedido mostrado na página.
2. Página da cafeteria criada em Projetos, funcionando no navegador, com cardápio, horários e botão para WhatsApp.
3. Captura real do DMG mostrando arrastar o aplicativo para Aplicativos.
4. Captura real do instalador Windows mostrando o botão de continuação.

Os marcadores são produzidos pelo componente `MediaPlaceholder` em `components/allm4/site-story.tsx` e devem ser substituídos pelos arquivos reais antes da publicação definitiva. Eles não são botões de vídeo nem capturas simuladas do aplicativo.

## Condições comerciais
O preço de R$ 49,99 foi mencionado pelo assistente na conversa, mas ainda não confirmado pelo responsável. Não foi apresentado como fato nesta versão. Tampouco foi fixado um número de usos sem confirmação da regra publicada. Mantidas as condições já informadas no site: uso inicial gratuito com limite, pagamento único, até 3 computadores e futuras atualizações incluídas. A página informa que preço e limite devem ser consultados no aplicativo antes da compra.

Antes de publicar, confirmar preço e limites e mostrá-los aqui de forma explícita. Não usar “mais barato” ou promessas de funcionamento integral em qualquer computador sem comprovação.

## Preservado
- Arquivos da prévia social v2, metadados, favicons e regras de CSP.
- Consulta de releases, validação de URLs/assinaturas dos assets, fallback, contadores, timeout e atualização periódica.
- Cupom dinâmico, copiar cupom, modais de capturas, abas, histórico de galerias e controles avançados existentes.
- Instruções alternativas para bloqueios de instalação e botão de copiar comando.
- Links de contato, documentação e avisos sobre os documentos legais ainda não publicados.
- Configuração de desenvolvimento Next/Vinext, dependências, lockfile e workflow de publicação.

O workflow `review-site.yml` só valida esta branch e salva artefatos por 2 dias. Tem permissão de leitura e não contém deploy, push, merge ou alteração da main.

## Teste local
Usar uma cópia separada para não interferir em alterações locais existentes. Node >= 22.13, conforme package.json. `npm ci`, seguido de `npm run dev`. O comando de desenvolvimento existente abre a porta 5173 por padrão. Não houve troca de framework.

Validar desktop e celular; três abas; galeria e fechamento por Escape; navegação por âncoras; downloads; dois guias e alternativas; FAQ; cupom quando disponível. A segurança e correção do conteúdo do aplicativo não foram alteradas por esta revisão visual.
