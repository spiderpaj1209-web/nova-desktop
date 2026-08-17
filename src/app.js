const KEY='nova-desktop-state-v1';
const state=JSON.parse(localStorage.getItem(KEY)||'{"chats":[{"id":"welcome","name":"Nova Desktop","messages":[{"role":"assistant","text":"Salut. Je suis la fondation de Nova Desktop. Ma mémoire, mon Replay et mon interface sont prêts à évoluer."}]}],"active":"welcome","memory":[],"replay":[]}');
const $=s=>document.querySelector(s); const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
function active(){return state.chats.find(c=>c.id===state.active)}
function render(){const c=active();$('#title').textContent=c.name;$('#chats').innerHTML=state.chats.map(x=>`<button data-id="${x.id}" class="${x.id===state.active?'active':''}">${x.name}</button>`).join('');$('#messages').innerHTML=c.messages.map(m=>`<div class="message ${m.role==='user'?'user':''}">${m.text}</div>`).join('');$('#messages').scrollTop=999999;document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{state.active=b.dataset.id;save();render()})}
function log(action){state.replay.unshift({at:new Date().toLocaleString('fr-FR'),action});save()}
$('#composer').onsubmit=e=>{e.preventDefault();const text=$('#input').value.trim();if(!text)return;active().messages.push({role:'user',text});log('Message envoyé : '+text.slice(0,80));active().messages.push({role:'assistant',text:'Le moteur IA local sera connecté ici. Pour l’instant, Nova a enregistré ton message dans le chat et Replay.'});$('#input').value='';save();render()};
$('#newChat').onclick=()=>{const id=crypto.randomUUID();state.chats.push({id,name:'Nouveau projet',messages:[]});state.active=id;log('Nouveau chat créé');save();render()};
function panel(title,html){$('#panelTitle').textContent=title;$('#panelContent').innerHTML=html;$('#panel').showModal()}
$('#memoryBtn').onclick=()=>panel('Mémoire',state.memory.length?state.memory.map(x=>`<p>• ${x}</p>`).join(''):'<p>Aucun souvenir enregistré dans cette base.</p>');
$('#replayBtn').onclick=()=>panel('Nova Replay',state.replay.length?state.replay.map(x=>`<p>${x.at} — ${x.action}</p>`).join(''):'<p>Aucune action enregistrée.</p>');
$('#close').onclick=()=>$('#panel').close();
$('#voice').onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert('Reconnaissance vocale à ajouter dans la version Windows.');const r=new R();r.lang='fr-FR';r.onresult=e=>$('#input').value=e.results[0][0].transcript;r.start()};render();
