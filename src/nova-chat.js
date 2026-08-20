(() => {
  const MODEL = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
  const KEY = 'nova-local-chat-v1';
  let engine, loading, webllm;
  const history = JSON.parse(localStorage.getItem(KEY) || '[]');
  const nav = document.querySelector('aside');
  const main = document.querySelector('main');
  if (!nav || !main) return;
  const button = document.createElement('button');
  button.className = 'nav'; button.textContent = 'Chat avec Nova';
  nav.insertBefore(button, nav.firstElementChild.nextElementSibling);
  const section = document.createElement('section');
  section.id = 'chat'; section.className = 'hidden';
  section.innerHTML = `<div class="box"><h3>Chat avec Nova</h3><p class="label" id="novaStatus">Cerveau local non chargé.</p><div class="log" id="novaMessages"></div><textarea id="novaInput" placeholder="Parle à Nova…" style="min-height:80px;margin-top:12px"></textarea><div class="actions"><button class="primary" id="novaSend">Envoyer</button><button id="novaClear">Effacer le chat</button></div></div>`;
  main.appendChild(section);
  const messages = document.getElementById('novaMessages');
  const status = document.getElementById('novaStatus');
  const input = document.getElementById('novaInput');
  const render = () => { messages.innerHTML = history.map(x => `<p><b>${x.role === 'user' ? 'Toi' : 'Nova'} :</b> ${x.text}</p>`).join('') || '<p>Dis bonjour à Nova.</p>'; messages.scrollTop = messages.scrollHeight; };
  const add = (role, text) => { history.push({ role, text }); localStorage.setItem(KEY, JSON.stringify(history.slice(-100))); render(); };
  async function brain() {
    if (engine) return engine;
    if (loading) return loading;
    loading = (async () => {
      if (!navigator.gpu) throw new Error('WebGPU n’est pas disponible.');
      status.textContent = 'Téléchargement et chargement du cerveau local…';
      webllm ??= await import('https://esm.run/@mlc-ai/web-llm');
      engine = await webllm.CreateMLCEngine(MODEL, { initProgressCallback: p => status.textContent = `Cerveau local — ${p.text || 'chargement'} ${Math.round((p.progress || 0) * 100)} %` });
      status.textContent = 'Cerveau local prêt.';
      return engine;
    })();
    try { return await loading; } finally { loading = null; }
  }
  async function send() {
    const text = input.value.trim(); if (!text) return;
    input.value = ''; add('user', text); status.textContent = 'Nova réfléchit…';
    try {
      const local = await brain();
      const reply = await local.chat.completions.create({ messages: [{ role: 'system', content: 'Tu es Nova, assistant personnel local. Réponds en français de façon claire.' }, ...history.slice(-12).map(x => ({ role: x.role === 'user' ? 'user' : 'assistant', content: x.text }))], stream: false });
      add('assistant', reply.choices[0].message.content || 'Je n’ai pas pu répondre.'); status.textContent = 'Cerveau local prêt.';
    } catch (error) { add('assistant', `Erreur : ${error.message}`); status.textContent = 'Cerveau local indisponible.'; }
  }
  button.onclick = () => { document.querySelectorAll('main section').forEach(x => x.classList.add('hidden')); section.classList.remove('hidden'); };
  document.getElementById('novaSend').onclick = send;
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  document.getElementById('novaClear').onclick = () => { history.length = 0; localStorage.removeItem(KEY); render(); };
  render();
})();
