#!/bin/bash

# Script de gestion MongoDB pour EpiTrello

case "$1" in
  start)
    echo "🚀 Démarrage de MongoDB..."
    # Créer le répertoire de données s'il n'existe pas
    sudo mkdir -p /data/db
    sudo chown -R $(whoami) /data/db
    
    # Démarrer MongoDB en arrière-plan
    mongod --fork --logpath /tmp/mongodb.log --dbpath /data/db
    
    if [ $? -eq 0 ]; then
      echo "✅ MongoDB démarré avec succès"
      echo "📝 Logs: tail -f /tmp/mongodb.log"
    else
      echo "❌ Erreur lors du démarrage de MongoDB"
      echo "📝 Vérifiez les logs: cat /tmp/mongodb.log"
    fi
    ;;

  stop)
    echo "🛑 Arrêt de MongoDB..."
    mongod --shutdown --dbpath /data/db
    
    # Alternative si la commande ci-dessus ne fonctionne pas
    pkill -f mongod
    
    echo "✅ MongoDB arrêté"
    ;;

  status)
    echo "📊 Statut de MongoDB..."
    if pgrep -x mongod > /dev/null; then
      echo "✅ MongoDB est en cours d'exécution"
      ps aux | grep mongod | grep -v grep
    else
      echo "❌ MongoDB n'est pas en cours d'exécution"
    fi
    ;;

  view)
    echo "📋 Données dans la base epitrello:"
    echo ""
    echo "👥 === UTILISATEURS ==="
    mongosh epitrello --quiet --eval "db.users.find({}, {password: 0}).pretty()"
    
    echo ""
    echo "📊 === TABLEAUX ==="
    mongosh epitrello --quiet --eval "db.boards.find().pretty()"
    
    echo ""
    echo "📈 === STATISTIQUES ==="
    mongosh epitrello --quiet --eval "print('Utilisateurs: ' + db.users.countDocuments()); print('Tableaux: ' + db.boards.countDocuments());"
    ;;

  shell)
    echo "🐚 Ouverture du shell MongoDB..."
    echo "💡 Commandes utiles:"
    echo "   show dbs              - Voir toutes les bases"
    echo "   use epitrello         - Sélectionner la base"
    echo "   show collections      - Voir les collections"
    echo "   db.users.find()       - Voir les utilisateurs"
    echo "   db.boards.find()      - Voir les tableaux"
    echo "   exit                  - Quitter"
    echo ""
    mongosh epitrello
    ;;

  clear)
    echo "⚠️  ATTENTION: Ceci va supprimer TOUTES les données!"
    read -p "Êtes-vous sûr? (tapez 'oui' pour confirmer): " confirm
    
    if [ "$confirm" = "oui" ]; then
      echo "🗑️  Suppression des données..."
      mongosh epitrello --quiet --eval "db.users.deleteMany({}); db.boards.deleteMany({});"
      echo "✅ Base de données vidée"
    else
      echo "❌ Annulé"
    fi
    ;;

  *)
    echo "🔧 Script de gestion MongoDB pour EpiTrello"
    echo ""
    echo "Usage: ./mongo.sh [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start   - Démarrer MongoDB"
    echo "  stop    - Arrêter MongoDB"
    echo "  status  - Vérifier l'état de MongoDB"
    echo "  view    - Voir les données dans la base"
    echo "  shell   - Ouvrir le shell MongoDB"
    echo "  clear   - Vider la base de données (⚠️  DANGER)"
    echo ""
    echo "Exemples:"
    echo "  ./mongo.sh start"
    echo "  ./mongo.sh view"
    echo "  ./mongo.sh shell"
    ;;
esac
