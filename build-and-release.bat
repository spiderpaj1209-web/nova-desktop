@echo off
echo === Pulling latest changes ===
git pull

echo === Building Nova Desktop ===
cd nova-chat-interface
call build-v2.bat

echo === Build complete ===
echo L'exe sera dans le dossier dist/
echo Tu peux maintenant l'installer pour mettre a jour Nova
pause
