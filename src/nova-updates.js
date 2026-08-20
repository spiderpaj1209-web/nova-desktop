function setText(element, value) {
  if (element) element.textContent = value;
}

function setBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.textContent = busy ? "Vérification…" : "Mettre à jour";
}

export function initUpdater({ button, status, version }) {
  const updater = window.nova?.updater;
  const appVersion = window.nova?.app?.version;

  if (typeof appVersion === "function") {
    appVersion().then((value) => setText(version, `Version installée : ${value}`)).catch(() => setText(version, "Version installée : inconnue"));
  } else {
    setText(version, "Version installée : développement");
  }

  button?.addEventListener("click", async () => {
    setBusy(button, true);
    setText(status, "Vérification des mises à jour…");

    try {
      if (!updater?.check) {
        setText(status, "Le système de mise à jour sera activé dans une prochaine version.");
        return;
      }

      const result = await updater.check();

      if (!result?.available) {
        setText(status, "Nova est déjà à jour.");
        return;
      }

      setText(status, `Téléchargement de Nova ${result.version}…`);
      await updater.download();
      setText(status, "Mise à jour prête. Redémarrage de Nova…");
      await updater.install();
    } catch (error) {
      setText(status, "Impossible de vérifier la mise à jour. Réessaie plus tard.");
      console.error("Nova update failed", error);
    } finally {
      setBusy(button, false);
    }
  });
}
