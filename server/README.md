# 🚀 EpiTrello Server

Backend API pour l'application EpiTrello - Un système de gestion de tableaux Kanban avec authentification.

## 📋 Technologies

- **Node.js** + **Express** - Serveur et API REST
- **MongoDB** + **Mongoose** - Base de données
- **JWT** - Authentification par token
- **bcryptjs** - Hashage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

## 🔧 Installation

### Prérequis

- Node.js >= 16.x
- MongoDB installé et en cours d'exécution

### Étapes

1. **Installer les dépendances**

```bash
cd server
npm install
```

2. **Configurer les variables d'environnement**

Copier `.env.example` vers `.env` et modifier les valeurs :

```bash
cp .env.example .env
```

Variables importantes :
- `MONGODB_URI` : URI de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `PORT` : Port du serveur (par défaut 5000)

3. **Démarrer MongoDB**

```bash
# Sur Linux/Mac
sudo systemctl start mongod

# Sur Windows avec MongoDB installé
mongod
```

4. **Démarrer le serveur**

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📡 API Endpoints

### Authentification

#### POST `/api/auth/register`
Créer un nouveau compte utilisateur

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Se connecter avec un compte existant

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Tableaux (Routes protégées - Token JWT requis)

**Header requis:**
```
Authorization: Bearer <token>
```

#### GET `/api/boards`
Récupérer tous les tableaux de l'utilisateur

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "boards": [...]
}
```

#### GET `/api/boards/:id`
Récupérer un tableau spécifique

#### POST `/api/boards`
Créer un nouveau tableau

**Body:**
```json
{
  "title": "Mon projet",
  "columns": {},
  "cards": {},
  "columnOrder": []
}
```

#### PUT `/api/boards/:id`
Mettre à jour un tableau

**Body:**
```json
{
  "title": "Nouveau titre",
  "columns": {...},
  "cards": {...},
  "columnOrder": [...]
}
```

#### DELETE `/api/boards/:id`
Supprimer un tableau

## 🗂️ Structure du projet

```
server/
├── config/
│   └── database.js          # Configuration MongoDB
├── models/
│   ├── User.js             # Modèle utilisateur
│   └── Board.js            # Modèle tableau
├── routes/
│   ├── auth.js             # Routes d'authentification
│   └── boards.js           # Routes des tableaux
├── middleware/
│   └── auth.js             # Middleware de protection JWT
├── server.js               # Point d'entrée
├── .env                    # Variables d'environnement
├── .env.example           # Template des variables
└── package.json
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Tokens JWT avec expiration configurable
- Validation des entrées utilisateur
- Protection CORS configurée
- Routes protégées par middleware d'authentification

## 🐛 Debugging

Pour voir les logs MongoDB :
```bash
# Activer les logs Mongoose
set DEBUG=mongoose:* && npm run dev
```

Pour tester l'API :
```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

## 📝 Notes

- En développement, CORS est ouvert pour `http://localhost:3000`
- Changer `JWT_SECRET` en production
- Utiliser MongoDB Atlas pour le déploiement
- Les tokens JWT expirent après 7 jours par défaut

## 🤝 Contribution

Ce projet fait partie du cursus Epitech.
