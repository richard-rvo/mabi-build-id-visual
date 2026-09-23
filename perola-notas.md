# Pérola — direção 03 da Mabi

Estudo local solicitado em 23/09/2026. Escopo final: apenas a nova versão dentro
de `mabi-direcoes`, sem publicação. Mesa e Pulso não foram alteradas nesta rodada.

- [Apresentação](perola.html)
- [Home](perola-home.html)
- [Chat](perola-chat.html)

## Direção

Pérola interpreta a precisão visual de interfaces Apple em uma identidade própria:
branco quente, grafite, champagne e verde mineral, sem azul. Tipografia de sistema,
curvas coerentes, fotografia editorial e profundidade sutil; transparência restrita
aos controles. Tema exclusivamente claro.

A referência consultada foi a apresentação oficial da
[nova linguagem de design da Apple](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/).
As camadas, curvas e foco em conteúdo são interpretados em HTML/CSS; este estudo
não implementa a refração nativa de Liquid Glass e não distribui fontes da Apple.

O produto permanece orientado à alimentação e ao cuidado entre consultas.
Registro é contexto, não pontuação. A nutricionista continua sendo a referência.
Dados são fictícios e respostas são prontas, sem IA, backend ou persistência.

## Arquivos

`perola.html` apresenta as duas telas. `perola.css` e `perola-study.css` contêm a
identidade e a apresentação; `perola-interactions.js` isola as interações desta
direção. Os estilos básicos e ícones existentes são reutilizados sem alterações.

Assets novos:

- [Fotografia editorial](assets/perola-editorial.png), criada com o tool integrado
  `image_gen`, sem API/CLI de fallback.
- [Símbolo perolado](assets/perola-symbol.svg), SVG original editável.

Prompt final da fotografia:

> Use case: photorealistic-natural. Asset type: food editorial image for a premium light-mode nutrition mobile interface called Mabi, no branding in image. Create an exquisite but believable quiet still-life photograph: a shallow matte ivory ceramic bowl with two natural green pears, one ripe fig cut in half with burgundy interior and one whole fig beside the bowl, a tiny olive branch, on a pale warm limestone tabletop. Very soft morning window light from upper left, beautifully nuanced grounded shadows to lower right. Natural fruit texture, restrained art direction, luxury independent food magazine photography, not glossy advertising or cartoon. Color palette ivory, warm stone, muted pear green, burgundy fig, graphite shadows, absolutely no blue. Composition: square 1024x1024, subjects composed predominantly center-right with broad quiet warm-white space to the left, top quarter almost empty, camera at a slightly elevated 35 degree angle. Large bowl, crop-safe subjects within central 70%, no text, no logos, no labels, no people, no cutlery, no busy props, no UI. The result must feel tactile, elegant and real. Save the final image as an available local artifact.

## Validação

- Revisão visual em Chrome de Home, chat e apresentação.
- Home e chat em 320, 390 e 430 px: sem rolagem horizontal; controles visíveis
  com alvo de pelo menos 44 × 44 px.
- Checagem de contraste dos textos visíveis sobre superfícies sólidas;
  fotografia, gradientes e transparência também revisados visualmente.
- Registro simulado atualiza o resumo; envio recebe resposta de exemplo;
  nova conversa e histórico verificados no navegador.
- Sintaxe do JavaScript, links da documentação e guarda de contraste do projeto
  verificados. A guarda do projeto não cobre os CSS deste protótipo.

Não comprova acessibilidade integral, teclado nativo, dispositivo físico,
autenticação ou integrações. Esses itens ficam para a adoção futura no aplicativo.
