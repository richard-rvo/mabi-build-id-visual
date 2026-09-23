/* Interações isoladas da proposta Pérola. Sem IA, backend ou persistência. */
'use strict';
const theme = document.body.dataset.theme;
const sheet = document.getElementById('sheet');
const sheetTitle = document.getElementById('sheet-title');
const sheetBody = document.getElementById('sheet-body');
const messages = document.getElementById('messages');
const input = document.getElementById('message-input');
const initialConversation = messages?.innerHTML;
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
let toastTimer;
let attachment = null;
let sending = false;
let responseTimer;
let registered = [true, true, false, false, false];
let previousConversation = null;
let lastFocus = null;

function openSheet(title, html) {
  lastFocus = document.activeElement;
  sheetTitle.textContent = title;
  sheetBody.innerHTML = html;
  if (!sheet.open) sheet.showModal();
}
function closeSheet() { sheet.close(); }
sheet.addEventListener('close', () => lastFocus?.focus());
sheet.addEventListener('click', (event) => {
  if (event.target === sheet) {
    const box = sheet.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeSheet();
  }
});
function toast(text) {
  const element = document.getElementById('toast');
  element.textContent = text;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 3500);
}
function toolsSheet() {
  const options = [
    ['chef', 'Receita rápida', 'Uma ideia a partir dos ingredientes.', 'Quero uma ideia de receita.'],
    ['food', 'Comparar um cardápio', 'Entenda as opções de uma foto.', 'Quero comparar opções de um cardápio.'],
    ['scan', 'Entender um rótulo', 'Ingredientes e informações em contexto.', 'Quero entender um rótulo.'],
  ];
  openSheet('O que vamos resolver?', `<p>Escolha uma ajuda para este momento.</p>${options.map(([glyph, title, subtitle, prompt]) => `<button class="starter" data-prompt="${prompt}">${icon(glyph)}<span><strong>${title}</strong><small>${subtitle}</small></span>${icon('arrow')}</button>`).join('')}<h3>Ferramentas locais</h3><button class="starter" data-action="scope:Substituir alimento">${icon('food')}<span><strong>Substituir alimento</strong><small>Comparar equivalências.</small></span>${icon('arrow')}</button><button class="starter" data-action="scope:Planejador de corrida">${icon('move')}<span><strong>Planejador de corrida</strong><small>Organizar hidratação e carboidrato.</small></span>${icon('arrow')}</button>`);
}
function registerSheet() {
  const labels = ['Hidratação', 'Alimentação', 'Sono', 'Movimento', 'Intestino'];
  openSheet('Seu dia, no seu tempo', `<p>Simule quais acompanhamentos já foram registrados. No aplicativo, cada item abre seu formulário específico.</p><form id="register-form">${labels.map((name, index) => `<label><input type="checkbox" name="marker" value="${index}" ${registered[index] ? 'checked' : ''}>${name}</label>`).join('')}<button class="primary" type="submit">Aplicar à demonstração ${icon('check')}</button></form><p class="preview-note" style="margin-top:14px">Nenhum dado de saúde é salvo. Esta seleção demonstra apenas o resumo visual.</p>`);
}
function updateRegistrations() {
  const count = registered.filter(Boolean).length;
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = `${count} de 5`; });
  document.querySelectorAll('.marker').forEach((el, index) => {
    el.classList.toggle('done', registered[index]);
    el.querySelector('.marker-glyph').innerHTML = icon(registered[index] ? 'check' : ['water', 'food', 'moon', 'move', 'pulse'][index]);
  });
  const list = document.querySelector('.marker-list');
  if (list) list.setAttribute('aria-label', ['Hidratação', 'Alimentação', 'Sono', 'Movimento', 'Intestino'].map((label, i) => `${label}: ${registered[i] ? 'registrado' : 'sem registro'}`).join('. '));
  document.querySelectorAll('.progress-pips i').forEach((el, i) => el.classList.toggle('done', i < count));
  const ring = document.querySelector('.ring');
  if (ring) {
    ring.textContent = `${count}/5`;
    ring.style.setProperty('--progress', `${count * 20}%`);
  }
}
document.addEventListener('submit', event => {
  if (event.target.id === 'register-form') {
    event.preventDefault();
    registered = registered.map((_, i) => !!event.target.querySelector(`[value="${i}"]`).checked);
    updateRegistrations();
    closeSheet();
    toast('Resumo atualizado somente nesta demonstração.');
  }
});
function resetConversation() {
  if (!messages) return;
  if (messages.querySelector('.message')) previousConversation = messages.innerHTML;
  clearTimeout(responseTimer);
  sending = false;
  messages.removeAttribute('aria-busy');
  messages.innerHTML = initialConversation;
  clearAttachment();
  input.value = '';
  input.focus();
  syncSend();
}
function followEnd() {
  const scroll = document.getElementById('chat-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}
function appendMessage(text, role) {
  const bubble = document.createElement('div');
  bubble.className = `message ${role}`;
  if (role === 'assistant') {
    const byline = document.createElement('div');
    byline.className = 'byline';
    byline.innerHTML = `${icon('mabi')} MABI · EXEMPLO`;
    bubble.append(byline);
  }
  const p = document.createElement('p');
  p.textContent = text;
  bubble.append(p);
  messages.append(bubble);
  followEnd();
  return bubble;
}
function demoReply(text) {
  const normalized = text.toLocaleLowerCase('pt-BR');
  if (/r[oó]tulo|card[aá]pio/.test(normalized)) return 'Podemos olhar os ingredientes e as informações da embalagem ou do cardápio. No aplicativo, você enviaria uma foto aqui. Neste protótipo, a foto fica apenas no seu navegador e não é analisada.';
  if (/preparo/.test(normalized)) return 'Para a ideia de exemplo: lave e corte o tomate, refogue e acrescente os ovos, deixando cozinhar bem. Sirva com o pão, se fizer sentido para você. Ajustes da sua alimentação seguem com sua nutricionista.';
  if (/rotina|corrid|organiz/.test(normalized)) return 'Podemos começar por uma coisa pequena: identificar o horário em que fica mais difícil comer com tranquilidade. Qual momento costuma apertar mais por aí?';
  if (/ideia|receita|ingrediente/.test(normalized)) return 'Vamos começar com o que você já tem. Quais ingredientes estão disponíveis e quanto tempo você tem para preparar?';
  return 'Esta é uma resposta demonstrativa, sem análise da sua mensagem. No aplicativo, a Mabi ajuda com a rotina alimentar; dúvidas clínicas e mudanças de conduta seguem com a sua nutricionista.';
}
function syncSend() {
  const send = document.querySelector('.send');
  if (send) send.disabled = sending || (!input.value.trim() && !attachment);
}
function sendMessage(text) {
  if (!messages) { location.href = `${theme}-chat.html?prompt=${encodeURIComponent(text)}`; return; }
  if (sending || (!text.trim() && !attachment)) return;
  if (sheet.open) closeSheet();
  messages.querySelector('.chat-welcome')?.remove();
  messages.querySelector('.message-actions')?.remove();
  const bubble = appendMessage(text.trim() || 'Foto anexada para demonstração.', 'user');
  if (attachment) {
    const image = document.createElement('img');
    image.src = attachment.url;
    image.alt = 'Foto selecionada localmente, sem envio externo';
    image.className = 'attachment-preview';
    bubble.append(image);
    // O objeto permanece válido enquanto sua mensagem estiver visível.
    attachment = null;
    document.getElementById('attachment-note').hidden = true;
  }
  input.value = '';
  input.style.height = '';
  sending = true;
  messages.setAttribute('aria-busy', 'true');
  syncSend();
  const typing = document.createElement('p');
  typing.className = 'chat-date';
  typing.textContent = 'Preparando resposta de exemplo…';
  messages.append(typing);
  followEnd();
  responseTimer = setTimeout(() => {
    typing.remove();
    appendMessage(demoReply(text), 'assistant');
    sending = false;
    messages.removeAttribute('aria-busy');
    syncSend();
  }, 650);
}
function clearAttachment() {
  if (attachment) URL.revokeObjectURL(attachment.url);
  attachment = null;
  const note = document.getElementById('attachment-note');
  if (note) note.hidden = true;
  const file = document.getElementById('photo-input');
  if (file) file.value = '';
  if (input) syncSend();
}
document.addEventListener('click', event => {
  const target = event.target.closest('[data-action], [data-prompt]');
  if (!target) return;
  event.preventDefault();
  if (target.dataset.prompt) { sendMessage(target.dataset.prompt); return; }
  const action = target.dataset.action;
  if (action.startsWith('scope:')) {
    const title = action.slice(6);
    openSheet(title, '<p>Este destino permanece na navegação da Mabi. O estudo detalha Hoje e Chat; esta página não foi redesenhada nesta rodada.</p><p class="preview-note">Use Hoje e Mabi na barra inferior para explorar as duas telas completas.</p>');
    return;
  }
  const actions = {
    close: closeSheet,
    tools: toolsSheet,
    register: registerSheet,
    new: resetConversation,
    'remove-attachment': clearAttachment,
    attach: () => document.getElementById('photo-input').click(),
    care: () => openSheet('Seu cuidado, conectado', `<p><strong>Camila Lima</strong> é a nutricionista fictícia deste estudo. Aqui, o vínculo dá contexto à rotina e mantém a profissional ao alcance.</p><p>Os registros ajudam a preparar a próxima conversa. O aplicativo não indica que a nutri está online ou já leu seus dados sem confirmação.</p><button class="primary" data-action="handoff">Conversar com minha nutri ${icon('arrow')}</button>`),
    handoff: () => openSheet('Levar para sua nutri', `<p>Questões clínicas, sintomas ou mudanças na sua alimentação precisam da sua nutricionista.</p><p class="preview-note">Esta é uma simulação. Nenhuma mensagem será enviada à profissional.</p><button class="primary" data-action="handoff-demo">Simular encaminhamento ${icon('arrow')}</button>`),
    'handoff-demo': () => { closeSheet(); toast('Encaminhamento demonstrado. Nada foi enviado.'); },
    history: () => openSheet('Suas conversas', `<p>Histórico demonstrativo desta navegação. Nenhuma conversa é gravada ao fechar a página.</p><button class="starter" data-action="restore">${icon('chat')}<span><strong>${previousConversation ? 'Conversa anterior nesta sessão' : 'Uma ideia para o jantar'}</strong><small>Exemplo · hoje</small></span>${icon('chevron')}</button>`),
    restore: () => {
      clearTimeout(responseTimer);
      sending = false;
      messages.removeAttribute('aria-busy');
      messages.innerHTML = previousConversation || (theme === 'pulso' ? initialConversation : '');
      if (!previousConversation && theme === 'perola') {
        appendMessage('Estou sem ideias para o jantar.', 'user');
        appendMessage('Vamos começar com o que você já tem. Quais ingredientes estão disponíveis?', 'assistant');
      }
      closeSheet();
      syncSend();
      followEnd();
    },
    suggestion: () => openSheet('Comece pelo que você tem', `<p>Uma refeição possível começa com a sua rotina. A Mabi pode ajudar a transformar ingredientes disponíveis em uma ideia culinária.</p><img src="assets/perola-editorial.png" alt="Ilustração de refeição" style="display:block;width:150px;height:145px;margin:auto"><h3>Abra a geladeira, sem pressa.</h3><p>Escolha os ingredientes que você gostaria de usar e conte quanto tempo tem.</p><button class="primary" data-prompt="Quero uma ideia com o que tenho em casa.">Pensar junto com a Mabi ${icon('arrow')}</button>`),
    article: () => openSheet('O prato possível', '<p class="eyebrow">Leitura de exemplo · 3 min</p><h3>O que cabe na sua vida hoje?</h3><p>Nem todo dia dá para cozinhar do zero. Às vezes, uma opção simples e acessível é o que faz sentido.</p><p>Olhar o que você já tem, organizar alguns ingredientes e conversar sobre as dificuldades com sua nutricionista pode ajudar a encontrar caminhos para a sua rotina.</p><p class="preview-note">Conteúdo demonstrativo do estudo visual. Não é uma orientação individual.</p>'),
    evolution: () => openSheet('Um olhar para a semana', '<p>Presença de registros · 17 a 23 de setembro.</p><div class="bars" role="img" aria-label="Exemplo: três, dois, cinco, um, quatro, três e dois registros por dia.">'+[60,40,100,20,80,60,40].map((value,i)=>`<span style="height:${value}%"><small>${17+i}</small></span>`).join('')+'</div><p class="chart-note">Dados fictícios. As barras contam registros, sem avaliar a qualidade da alimentação ou resultados corporais.</p>'),
  };
  actions[action]?.();
});
if (input) {
  document.getElementById('chat-form').addEventListener('submit', event => { event.preventDefault(); sendMessage(input.value); });
  input.addEventListener('input', () => { input.style.height = '44px'; input.style.height = `${Math.min(input.scrollHeight, 105)}px`; syncSend(); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); sendMessage(input.value); } });
  document.getElementById('photo-input').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) { toast('Selecione uma imagem de até 8 MB.'); event.target.value = ''; return; }
    clearAttachment();
    attachment = { url: URL.createObjectURL(file) };
    const note = document.getElementById('attachment-note');
    note.innerHTML = '<span>Foto selecionada · permanece neste navegador</span><button data-action="remove-attachment">Remover</button>';
    note.hidden = false;
    syncSend();
  });
  syncSend();
  const prompt = new URLSearchParams(location.search).get('prompt');
  if (prompt) { resetConversation(); sendMessage(prompt.slice(0,1000)); }
}
