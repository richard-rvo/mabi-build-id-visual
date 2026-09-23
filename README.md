# Mabi — Mesa e Pulso

Estudo de identidade visual e UX de 23/09/2026, solicitado por Richard a partir
das seis capturas do aplicativo e do [PRD](../../PRD.md). As referências visuais
anteriores foram desconsideradas por instrução explícita nesta exploração.
Nenhuma direção foi adotada como identidade oficial ou aplicada ao app Expo.

## Abrir

Abra [index.html](index.html) no navegador. Funciona também por `file://`, sem
instalação, conexão, CDN ou build. Para servir localmente, na raiz do repositório:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory docs/previews/mabi-direcoes
```

Depois acesse `http://127.0.0.1:8765`.

| Proposta | Home | Chat | Direção |
|---|---|---|---|
| Mesa | [Hoje](mesa-home.html) | [Mabi](mesa-chat.html) | Terracota, creme e sálvia; Fraunces + DM Sans; editorial e acolhedora |
| Pulso | [Hoje](pulso-home.html) | [Mabi](pulso-chat.html) | Azul vivo, lima e gelo; Outfit + DM Sans; gráfica e prática |

As quatro telas são páginas independentes. A vitrine permite alternar a direção,
ver Home e Chat lado a lado e abrir cada página separadamente.

## Leitura e decisões

Nas capturas, a abertura da Home ocupa quase uma tela inteira; o acompanhamento
repete cards altos; a Mabi exige percorrer um catálogo antes de conversar; o dock
preto concentra peso visual e só identifica por texto o destino ativo.

As propostas preservam os cinco destinos conhecidos, cards arredondados e
alimentação antes dos indicadores. Diferenciam ação, orientação e vínculo por
cor, tipografia e composição. O acompanhamento vira um resumo compacto e os
rótulos da navegação permanecem visíveis. A área rolável, o campo de mensagem e
o dock têm espaços separados no layout.

**Mesa:** título editorial, ilustração orgânica, orientação culinária, vínculo
profissional antes do acompanhamento e uma abertura de chat com três situações
cotidianas. Recomendação inicial por favorecer a proximidade do pós-consulta.

**Pulso:** tipografia geométrica, contraste azul/lima, acesso rápido à conversa,
registro resumido e chat em andamento com ferramentas contextuais. A conversa
inicial é explicitamente um exemplo; não afirma que uma conversa real já existe.

São hipóteses de UX: acesso direto ao composer, reposicionamento do registro,
agrupamento de ferramentas e eventual retomada de conversa. Não são alterações
no contrato atual do launcher, nas sessões ou nas regras de produto do PRD.

## Interações e limites

- Home: abrir uma ideia e seguir para o chat, simular presença de registros,
  consultar histórico ilustrativo, vínculo e trecho editorial.
- Chat: escrever, enviar, anexar/remover imagem local, iniciar nova conversa,
  restaurar a conversa anterior desta navegação e abrir ferramentas.
- Encaminhamento à nutri: simulação explícita; não envia mensagens.
- Comunidade, Aprender, Perfil e ferramentas locais: aviso de escopo em modal.
  As páginas desses destinos não integram as quatro telas solicitadas.
- Dados fictícios, respostas prontas e estado em memória. Nenhum Supabase, IA,
  telemetria, dado real ou persistência. Recarregar reinicia a demonstração.
- O registro usa checkboxes apenas para demonstrar a presença visual de dados;
  no app, os formulários próprios de cada marcador continuam necessários.
- Estados de falha remota, autenticação, cota, teclado nativo e handoff real
  dependem de implementação e validação posterior. Não são simulados como entrega.

Os limites de produto vêm do PRD (§1.1, §1.5.4, §1.5.6, §2.1, §5 e §10.3):
nutricionista como autoridade clínica, ausência de prescrição por IA, histórico
acessível e indicadores de presença sem nota corporal. O estudo não adiciona
calorias, metas nutricionais automáticas, feed aberto ou promessa de uso ilimitado.

## Pesquisa

Consultada em 23/09/2026. A aplicação à Mabi é uma interpretação de design, não
uma garantia de melhora de usabilidade.

- [Apple: Behind the Design — Headspace](https://developer.apple.com/news/?id=fkfnhq8u):
  acolhimento por cor e ilustração; entrada organizada por situações do cotidiano.
- [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/):
  funções secundárias sob demanda; redução da decisão inicial.
- [NN/g: navegação mobile descobrível](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/):
  manutenção de destinos visíveis e compreensíveis.

Skill aplicada: `frontend-design`. Nenhum asset ou layout dos produtos pesquisados
foi copiado. Ilustrações e ícones em SVG foram desenhados para este estudo.

## Assets

Fontes variáveis locais obtidas do repositório oficial
[google/fonts](https://github.com/google/fonts), com licenças OFL incluídas:
[DM Sans](assets/dm-sans-OFL.txt), [Fraunces](assets/fraunces-OFL.txt) e
[Outfit](assets/outfit-OFL.txt). O protótipo não faz requisições externas.

## Validação

- Smoke em Chrome headless real via Playwright: quatro telas em larguras
  320, 390 e 430 px; vitrine em 320, 390, 768 e 1440 px.
- Interações de registro, Home → Chat, envio, nova conversa, histórico,
  anexo/remoção, modal e Escape; entrada HTML tratada como texto, sem execução.
- Abertura direta por `file://` e envio demonstrativo funcionando.
- Sem erros de JavaScript ou rolagem horizontal nos viewports verificados.
- Contraste calculado sobre os textos visíveis das quatro telas; alvos de toque
  verificados nesses viewports. Não equivale a auditoria integral WCAG.
- `npm run check:contrast`: 87 pares e 143 regras existentes passaram. Esse
  comando cobre o aplicativo; a checagem adicional acima cobre os protótipos.
- `npm run docs:check` e sintaxe dos scripts verificados.

Fora dessa evidência: Expo, aparelho físico, leitor de tela, teclado nativo,
autenticação e serviços remotos. Próximo aceite recomendado: comparar as duas
direções com pacientes ao registrar o dia, iniciar dúvida, recuperar conversa
e localizar a nutricionista.
