'use strict';
const concepts = {
  mesa: {
    number: 'DIREÇÃO 01 / MESA', title: 'O cotidiano<br>tem sabor.',
    description: 'O calor de uma mesa posta, a leveza de uma boa conversa. Uma Mabi próxima, humana e com presença editorial.',
    palette: 'TERRACOTA · CREME · SÁLVIA', colors: ['#a8442d','#f2dfce','#faf5ec','#48614b','#382b25'],
    colorNames: ['Terracota','Pêssego','Creme','Sálvia','Cacau'],
    notes: ['Serifa expressiva, ilustração de mesa e superfícies com calor.', 'Uma ideia alimentar primeiro. Cuidado profissional e registros em blocos compactos.', 'Campo de mensagem sempre à mão. Três situações reais abrem caminhos.'],
    home: 'Menos rolagem para chegar ao que importa.', chat: 'Uma conversa acolhedora desde a primeira tela.',
  },
  pulso: {
    number: 'DIREÇÃO 02 / PULSO', title: 'Leve no jeito.<br>Viva na rotina.',
    description: 'Cor com presença, informação com ritmo. Uma Mabi mais gráfica, espontânea e pronta para ajudar no próximo passo.',
    palette: 'AZUL VIVO · LIMA · GELO', colors: ['#244dcc','#e4efb0','#f4f6fc','#e1ecec','#1c2947'],
    colorNames: ['Azul vivo','Lima','Gelo','Névoa','Tinta'],
    notes: ['Tipografia geométrica, contrastes vivos e composições recortadas.', 'Ideia culinária, atalho de conversa e um resumo enxuto. Ações aparecem no contexto.', 'Conversa demonstrativa em andamento e modos compactos. A resposta vira algo útil na própria conversa.'],
    home: 'Ritmo visual para tornar o próximo passo evidente.', chat: 'Contexto e ajuda prática, dentro da conversa.',
  },
};
function selectConcept(name) {
  if (!concepts[name]) return;
  const concept = concepts[name];
  document.body.dataset.concept = name;
  document.querySelectorAll('[data-select]').forEach(button => {
    const active = button.dataset.select === name;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.getElementById('concept-number').textContent = concept.number;
  document.getElementById('concept-title').innerHTML = concept.title;
  document.getElementById('concept-description').textContent = concept.description;
  document.getElementById('palette-caption').textContent = concept.palette;
  document.getElementById('swatches').innerHTML = concept.colors.map((color,i) => `<span style="--swatch:${color}" title="${concept.colorNames[i]} ${color}"></span>`).join('');
  document.getElementById('swatches').setAttribute('aria-label', `Paleta ${name}: ${concept.colorNames.join(', ')}`);
  document.querySelectorAll('.design-notes dd').forEach((el,i) => { el.textContent = concept.notes[i]; });
  ['home','chat'].forEach(page => {
    document.getElementById(`${page}-frame`).src = `${name}-${page}.html`;
    document.getElementById(`${page}-frame`).title = `${page === 'home' ? 'Home' : 'Chat'} Mabi — proposta ${name}`;
    document.getElementById(`${page}-link`).href = `${name}-${page}.html`;
    document.getElementById(`${page}-caption`).textContent = concept[page];
  });
  history.replaceState(null, '', `#${name}`);
}
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => selectConcept(button.dataset.select)));
if (location.hash === '#pulso') selectConcept('pulso');
