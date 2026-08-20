# Configuration de l'auto-update (Nova Chat V2+)

Ce guide explique comment configurer l'auto-update pour que Nova se mette à jour tout seul, comme tu l'as vu avec la V1.

## Principe

- L'app Electron utilise `electron-updater` pour vérifier les nouvelles versions.
- Elle pointe vers les **GitHub Releases** du repo `spiderpaj1209-web/nova-desktop`.
- À chaque nouvelle version, tu publies un release avec l'installeur Windows.
- Les utilisateurs re çoivent une notification et peuvent cliquer sur "Installer et relancer".

## Fichiers clés

- `electron/main-autoupdate.js` : processus principal avec auto-update intégré.
- `package.json` : doit contenir `electron-updater` et la config `publish` pour electron-builder.

## Étapes pour activer l'auto-update

### 1. Installer electron-updater

Dans `nova-chat-interface` :

```bash
npm install --save-dev electron-updater@^5.3.0
```

### 2. Utiliser `main-autoupdate.js` comme point d'entré··e

Dans `package.json`, définis :

```json
"main": "electron/main-autoupdate.js"
```

(au lieu de `electron/main.js`)

### 3. Configurer `publish` dans `package.json`

Dans la section `"build"` de `package.json`, ajoute :

```json
"publish": {
  "provider": "github",
  "owner": "spiderpaj1209-web",
  "repo": "nova-desktop",
  "releaseType": "release"
}
```

Cela indique à electron-builder de publier les builds sur GitHub Releases.

### 4. Build et publish d'une version

Pour créer une nouvelle version (ex: V2) :

1. Mets à jour le numéro de version dans `package.json` :
   ```json
   "version": "2.0.0"
   ```

2. Lance le build + publish :
   ```bash
   npm install
   npm run dist
   ```

   Si tu as configuré·· un token GitHub (via `GH_TOKEN` env var), electron-builder peut publier directement.
   Sinon, tu peux uploader manuellement les artefacts sur GitHub Releases.

### 5. Créer le release sur GitHub

- Va sur https://github.com/spiderpaj1209-web/nova-desktop/releases
- Cr ee un nouveau release :
  - Tag : `v2.0.0`
  - Titre : `Nova Chat V2`
  - Description : notes de version
  - Upload les fichiers génér és dans `dist-electron/` (ex: `.exe`, `.yml`, etc.)

### 6. C té utilisateur

L'utilisateur :
- Lance Nova (V1)
- L'app check les updates au démarrage
- Trouve V2 sur GitHub Releases
- Télécharge et installe automatiquement
- Redé··marre avec V2

## Résumé pour toi

Pour chaque nouvelle version :

1. Mettre à jour `version` dans `package.json`
2. Push les changements sur GitHub
3. Build + publish (ou build + upload manuel sur GitHub Releases)
4. Les utilisateurs re çoivent la mise à jour automatiquement

## Notes

- Pour l'instant, l'interface est en mock (pas d'API).
- Tu peux faire évoluer l'interface autant que tu veux ; tant que le système d'update est en place, les utilisateurs la recevront automatiquement.
