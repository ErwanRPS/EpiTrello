#!/bin/bash

echo "🚀 Démarrage d'EpiTrello..."
echo ""

# Vérifier si MongoDB est en cours d'exécution
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB n'est pas en cours d'exécution"
    echo "Veuillez démarrer MongoDB avant de continuer:"
    echo "  sudo systemctl start mongod    (Linux)"
    echo "  brew services start mongodb-community    (Mac)"
    echo ""
    exit 1
fi

echo "✅ MongoDB est en cours d'exécution"
echo ""

# Démarrer le serveur backend
echo "📡 Démarrage du serveur backend..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Attendre que le serveur démarre
sleep 3

# Démarrer le client frontend
echo "🎨 Démarrage du client frontend..."
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ EpiTrello est prêt!"
echo ""
echo "📍 Backend API: http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"
echo ""

# Attendre que l'utilisateur arrête les serveurs
wait
