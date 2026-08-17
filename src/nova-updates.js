(() => {
  const header = document.querySelector('main header');
  if (!header || !window.novaUpdates) return;
  const box = document.createElement('div');
  box.className = 'box';
  box.style.cssText = 'margin:18px 0;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px';
  box.innerHTML = '<span class="label" id="novaUpdateText">Vérification des mises à jour…</span><button class="primary hidden" id="novaInstallUpdate">Redémarrer et installer</button>';
  header.insertAdjacentElement('afterend', box);
  const text = box.querySelector('#novaUpdateText');
  const install = box.querySelector('#novaInstallUpdate');
  install.onclick = () => { install.disabled = true; text.textContent = 'Installation de la mise à jour…'; window.novaUpdates.install(); };
  window.novaUpdates.onStatus(({ state, detail }) => {
    if (state === 'checking') text.textContent = 'Vérification des mises à jour…';
    if (state === 'current') text.textContent = 'Nova est à jour.';
    if (state === 'downloading') text.textContent = `Téléchargement de la mise à jour${detail ? ` — ${detail}` : '…'}`;
    if (state === 'ready') { text.textContent = `Mise à jour ${detail} prête.`; install.classList.remove('hidden'); }
    if (state === 'error') text.textContent = 'Mise à jour indisponible pour le moment.';
  });
})();
