const KEY = 'nova-desktop-state-v1';
const MODEL = 'Llama-3.2-3B-Instruct-q4f16_1-MLC';
const state = JSON.parse(localStorage.getItem(KEY) || '{"chats":[{"id":"welcome","name":"Nova Desktop","messages":[{"role":"assistant","text":"Salut. Je suis Nova. Mon cerveau local peut être installé depuis ce chat."}]}],"active":"welcome","memory":[],"replay":[]}');
const $ = s => document.querySelector(s);
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
let engine = null;
let loadingBrain = null;
let webllm = null;

function active() { return state.chats.find(c => c.id === state.active); }
function addMessage(role, text) { active().messages.push({ role, text }); save(); render(); }
function render() {
  const c = active();
  $('#title').textContent = c.name;
  $('#chats').innerHTML = state.chats.map(x => `<button data-id="${x.id}" class="${x.id === state.active ? 'active' : ''}">${x.name}</button>`).join('');
  $('#messages').innerHTML = c.messages.map(m => `<div class="message ${m.role === 'user' ? 'user' : ''}">${m.text}</div>`).join('');
  $('#messages').scrollTop = 999999;
  document.querySelectorAll('[data-id]').forEach(b => b.onclick = () => { state.active = b.dataset.id; save(); render(); });
}
function log(action) { state.replay.unshift({ at: new Date().toLocaleString('fr-FR'), action }); save(); }
function panel(title, html) { $('#panelTitle').textContent = title; $('#panelContent').innerHTML = html; $('#panel').showModal(); }
function setComposer(enabled) { $('#input').disabled = !enabled; $('#composer button[type=submit]')?.toggleAttribute('disabled', !enabled); }

async function ensureBrain() {
  if (engine) return engine;
  if (loadingBrain) return loadingBrain;
  if (!navigator.gpu) throw new Error('WebGPU n’est pas disponible dans cette version de Nova.');
  loadingBrain = (async () => {
    setComposer(false);
    addMessage('assistant', 'Installation du cerveau local : téléchargement et chargement sur le GPU en cours…');
    log('Installation du cerveau local lancée');
    webllm ??= await import('https://esm.run/@mlc-ai/web-llm');
    engine = await webllm.CreateMLCEngine(MODEL, {
      initProgressCallback: progress => {
        const message = `Cerveau local — ${progress.text || 'chargement'} (${Math.round((progress.progress || 0) * 100)} %)`;
        const last = active().messages.at(-1);
        if (last?.role === 'assistant') last.text = message;
        render();
      }
    });
    log('Cerveau local prêt sur WebGPU');
    addMessage('assistant', 'Cerveau local prêt. Tu peux maintenant me parler sans Ollama ni serveur externe.');
    setComposer(true);
    return engine;
  })();
  try { return await loadingBrain; } finally { loadingBrain = null; }
}

$('#composer').onsubmit = async e => {
  e.preventDefault();
  const text = $('#input').value.trim();
  if (!text) return;
  addMessage('user', text);
  log('Message envoyé : ' + text.slice(0, 80));
  $('#input').value = '';
  try {
    const localEngine = await ensureBrain();
    setComposer(false);
    addMessage('assistant', 'Nova réfléchit localement…');
    const messages = active().messages.filter(m => !m.text.includes('Nova réfléchit localement')).slice(-12).map(m => ({ role: m.role, content: m.text }));
    const reply = await localEngine.chat.completions.create({
      messages: [{ role: 'system', content: 'Tu es Nova, assistant local Windows. Réponds en français, clairement et sans prétendre avoir réalisé une action non effectuée.' }, ...messages],
      temperature: 0.7,
      stream: false
    });
    const last = active().messages.at(-1);
    last.text = reply.choices[0]?.message?.content?.trim() || 'Je n’ai pas pu produire de réponse.';
    log('Réponse générée par le cerveau local');
  } catch (error) {
    const last = active().messages.at(-1);
    if (last?.role === 'assistant' && last.text.includes('réfléchit')) last.text = `Le cerveau local n’a pas démarré : ${error.message}`;
    else addMessage('assistant', `Le cerveau local n’a pas démarré : ${error.message}`);
    log('Erreur cerveau local : ' + error.message);
  } finally { setComposer(true); save(); render(); }
};
$('#newChat').onclick = () => { const id = crypto.randomUUID(); state.chats.push({ id, name: 'Nouveau projet', messages: [] }); state.active = id; log('Nouveau chat créé'); save(); render(); };
$('#memoryBtn').onclick = () => panel('Mémoire', state.memory.length ? state.memory.map(x => `<p>• ${x}</p>`).join('') : '<p>Aucun souvenir enregistré dans cette base.</p>');
$('#replayBtn').onclick = () => panel('Nova Replay', state.replay.length ? state.replay.map(x => `<p>${x.at} — ${x.action}</p>`).join('') : '<p>Aucune action enregistrée.</p>');
$('#close').onclick = () => $('#panel').close();
$('#voice').onclick = () => { const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) return alert('Reconnaissance vocale à ajouter dans la version Windows.'); const r = new R(); r.lang = 'fr-FR'; r.onresult = e => $('#input').value = e.results[0][0].transcript; r.start(); };
render();
