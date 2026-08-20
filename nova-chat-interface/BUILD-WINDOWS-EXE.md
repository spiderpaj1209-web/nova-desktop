# Build de l'exe Windows (Nova Chat V2)

Ce guide est fait pour que tu puisses créer un "logiciel" Windows à partir de l'interface, comme la V1.

## Étape 1 – Installer Node.js

Si ce n'est pas déjà fait :

- Télécharge et installe Node.js (version 18 ou plus) : https://nodejs.org/

## Étape 2 – Cloner / mettre à jour le repo

Dans un terminal :

```bash
git pull origin main
```

Puis va dans le dossier :

```bash
cd nova-chat-interface
```

## Étape 3 – Installer les dépendances

```bash
npm install
```

Puis ajoute Electron et electron-builder :

```bash
npm install --save-dev electron@^31.0.0 electron-builder@^24.13.3
```

## Étape 4 – Configurer le build Next.js

Pour ce build, on utilise la config Electron :

- Copie `next.config-electron.js` vers `next.config.js` (ou remplace le contenu de `next.config.js` par celui de `next.config-electron.js`).

Exemple (PowerShell) :

```powershell
Copy-Item next.config-electron.js next.config.js -Force
```

## Étape 5 – Ajouter les scripts dans `package.json`

Ouvre `package.json` et modifie/ajoute :

- `"main": "electron/main.js"` à la racine du JSON
- Les scripts suivants dans `"scripts"` :

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "build:electron": "electron-builder",
  "dist": "npm run build && npm run build:electron"
}
```

## Étape 6 – Lancer le build Windows

Toujours dans `nova-chat-interface` :

```bash
npm run dist
```

Cela va :

1. Build l'interface Next.js en mode statique (dossier `out/`)
2. Lancer electron-builder pour créer l'exe Windows

## Étape 7 – Rcuprer le "logiciel"

À· la fin du build, tu trouveras un dossier du type :

- `dist-electron/` ou
- `release/`

Dedans, il y aura :

- Un installateur `.exe` (NSIS), ou
- Un dossier avec l'app portable

C'est ce dossier / cet exe que tu considé··es comme ta "V2".

## Mise à jour future (V3, V4, ...)

Quand une nouvelle version sort :

1. `git pull` pour récupérer les nouveaux fichiers
2. Dans `nova-chat-interface` :
   ```bash
   npm install
   npm run dist
   ```
3. Remplace l'ancien dossier / exe par le nouveau.

## Optionnel : script .bat

Si tu veux, on peut créer un fichier `build-windows.bat` à la racine de `nova-chat-interface` qui fait toutes les commandes ci-dessus en un clic.
