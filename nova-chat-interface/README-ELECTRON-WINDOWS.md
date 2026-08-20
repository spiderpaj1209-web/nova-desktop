# Nova Chat – Build Windows (Electron)

Ce dossier contient l'interface Nova Chat V2, packagable en application Windows avec Electron.

## Prérequis

- Node.js 18+ installé sur ta machine
- Git (pour cloner / pull le repo)

## Installation (premiere fois)

Depuis la racine du projet (`nova-chat-interface`) :

```bash
npm install
```

## Lancer en mode dev (pour tester)

1. Lancer Next.js :
   ```bash
   npm run dev
   ```
2. Dans un autre terminal, lancer Electron en mode dev (optionnel, si tu veux tester l'app desktop) :
   ```bash
   npx electron .
   ```

L'interface sera accessible sur http://localhost:3000.

## Build de l'application Windows

1. Installer les dépendances de build (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```

2. Ajouter Electron et electron-builder (si pas encore dans package.json) :
   ```bash
   npm install --save-dev electron@^31.0.0 electron-builder@^24.13.3
   ```

3. Mettre à jour `package.json` :

   - Ajouter `"main": "electron/main.js"` à la racine du `package.json`.
   - Ajouter les scripts :
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

4. Configurer Next.js pour un export static :

   Dans `next.config.js` :
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     distDir: 'out',
   };

   export default nextConfig;
   ```

5. Lancer le build complet :
   ```bash
   npm run dist
   ```

6. Rcuprer l'exe Windows :

   - Le build Electron sera dans un dossier du type :
     - `dist-electron/` ou
     - `release/` (selon la config electron-builder)
   - Tu y trouveras un installateur `.exe` (NSIS) ou un dossier avec l'app portable.

## Mise à jour (V2 → V3, etc.)

Quand une nouvelle version est disponible :

1. Faire un `git pull` pour récupérer les nouveaux fichiers.
2. Re-lancer :
   ```bash
   npm install
   npm run dist
   ```
3. Remplacer l'ancien exécutable / dossier par le nouveau dans `dist-electron`.

## Notes

- Pour l'instant, l'interface utilise des données mock, pas d'API externe.
- Si tu veux, on peut ajouter un script `.bat` qui lance directement l'exe ou le build.
