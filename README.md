# 📋 EpiTrello

<div align="center">

![EpiTrello Banner](https://img.shields.io/badge/EpiTrello-Kanban_Board-0ea5e9?style=for-the-badge&logo=trello)

Une application web Kanban inspirée de Trello, développée avec React et Vite pour le projet Epitech.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.4-000000?logo=react&logoColor=white)](https://github.com/pmndrs/zustand)

[Démo en ligne](#-déploiement) • [Installation](#-installation) • [Fonctionnalités](#-fonctionnalités)

</div>

---

## 🎯 Description

**EpiTrello** est une application de tableau Kanban simple et élégante qui vous permet d'organiser vos tâches de manière visuelle. Inspirée de Trello, elle offre une interface intuitive avec des colonnes personnalisables et des cartes déplaçables par glisser-déposer.

### ✨ Points forts

- 🎨 **Interface moderne** : Design épuré et responsive avec TailwindCSS
- 🚀 **Performances optimales** : Build ultra-rapide avec Vite
- 💾 **Sauvegarde automatique** : Persistance des données dans le localStorage
- 🎯 **Drag & Drop fluide** : Déplacez vos cartes facilement entre les colonnes
- 📱 **100% Responsive** : Fonctionne parfaitement sur desktop, tablette et mobile

---

## 📸 Aperçu

```
┌─────────────────────────────────────────────────────────────┐
│  📋 EpiTrello                                                │
│  Votre tableau Kanban personnel                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ À faire  │    │ En cours │    │   Fait   │             │
│  ├──────────┤    ├──────────┤    ├──────────┤             │
│  │ • Carte 1│    │ • Carte 3│    │ • Carte 4│             │
│  │ • Carte 2│    │          │    │          │             │
│  │          │    │          │    │          │             │
│  │ + Ajouter│    │ + Ajouter│    │ + Ajouter│             │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prérequis

- **Node.js** : version 16.x ou supérieure
- **npm** ou **yarn** : gestionnaire de paquets

### Étapes d'installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/ErwanRPS/EpiTrello.git
cd EpiTrello
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

4. **Ouvrir dans le navigateur**

L'application sera accessible à l'adresse : `http://localhost:3000`

### Scripts disponibles

```bash
npm run dev       # Démarre le serveur de développement
npm run build     # Compile l'application pour la production
npm run preview   # Prévisualise la version de production
npm run lint      # Vérifie le code avec ESLint
npm run format    # Formate le code avec Prettier
```

---

## ✨ Fonctionnalités

### Milestone 1 - Base du projet (✅ Terminée)

- ✅ Structure du projet avec Vite + React
- ✅ Configuration TailwindCSS, ESLint et Prettier
- ✅ Architecture organisée (`components/`, `pages/`, `store/`, `styles/`)
- ✅ Composants principaux : `Board`, `Column`, `Card`
- ✅ Affichage de 3 colonnes par défaut
- ✅ CRUD complet sur les cartes (Créer, Lire, Modifier, Supprimer)
- ✅ Design responsive et épuré

### Milestone 2 - Fonctionnalités avancées (✅ Terminée)

- ✅ Drag & Drop avec `react-beautiful-dnd`
- ✅ Gestion d'état global avec Zustand
- ✅ Persistance des données (localStorage)
- ✅ Déplacement de cartes entre colonnes
- ✅ Réinitialisation du tableau
- ✅ Prêt pour le déploiement

---

## 🏗️ Structure du projet

```
EpiTrello/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/         # Composants React réutilisables
│   │   ├── Card.jsx       # Composant carte individuelle
│   │   └── Column.jsx     # Composant colonne
│   ├── pages/             # Pages de l'application
│   │   └── Board.jsx      # Page principale du tableau
│   ├── store/             # État global (Zustand)
│   │   └── useBoardStore.js
│   ├── styles/            # Styles globaux
│   │   └── index.css
│   ├── App.jsx            # Composant racine
│   └── main.jsx           # Point d'entrée
├── index.html             # Template HTML
├── package.json           # Dépendances et scripts
├── vite.config.js         # Configuration Vite
├── tailwind.config.js     # Configuration TailwindCSS
├── postcss.config.js      # Configuration PostCSS
├── .eslintrc.cjs          # Configuration ESLint
├── .prettierrc            # Configuration Prettier
└── README.md              # Documentation
```

---

## 🛠️ Technologies utilisées

| Technologie | Version | Description |
|-------------|---------|-------------|
| **React** | 18.2 | Bibliothèque JavaScript pour créer des interfaces utilisateur |
| **Vite** | 5.0 | Build tool ultra-rapide pour le développement moderne |
| **TailwindCSS** | 3.4 | Framework CSS utility-first pour un design rapide |
| **Zustand** | 4.4 | Gestion d'état simple et performante |
| **react-beautiful-dnd** | 13.1 | Bibliothèque de drag & drop accessible et fluide |
| **ESLint** | 8.55 | Linter pour maintenir la qualité du code |
| **Prettier** | 3.1 | Formateur de code automatique |

---

## 💡 Utilisation

### Créer une carte

1. Cliquez sur **"+ Ajouter une carte"** dans une colonne
2. Remplissez le titre (obligatoire) et la description (optionnelle)
3. Cliquez sur **"Ajouter"**

### Modifier une carte

1. Cliquez sur **"✏️ Modifier"** sur une carte
2. Modifiez le titre et/ou la description
3. Cliquez sur **"Enregistrer"**

### Supprimer une carte

1. Cliquez sur **"🗑️ Supprimer"** sur une carte
2. La carte est supprimée immédiatement

### Déplacer une carte

1. Cliquez et maintenez sur une carte
2. Déplacez-la vers la position souhaitée (même colonne ou autre colonne)
3. Relâchez pour déposer

### Réinitialiser le tableau

1. Cliquez sur **"🔄 Réinitialiser"** en haut à droite
2. Confirmez l'action
3. Le tableau revient à son état initial

---

## 🌐 Déploiement

### Déployer sur Vercel

1. **Créer un compte sur [Vercel](https://vercel.com)**

2. **Installer Vercel CLI**

```bash
npm install -g vercel
```

3. **Déployer**

```bash
npm run build
vercel
```

4. **Suivre les instructions** et votre application sera en ligne en quelques secondes !

### Déployer sur Netlify

1. **Créer un compte sur [Netlify](https://netlify.com)**

2. **Installer Netlify CLI**

```bash
npm install -g netlify-cli
```

3. **Build et déploiement**

```bash
npm run build
netlify deploy --prod
```

### Configuration pour le déploiement

Créez un fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## 📝 Roadmap

### Améliorations futures

- [ ] Ajout de nouvelles colonnes dynamiquement
- [ ] Système de tags/labels colorés
- [ ] Mode sombre (dark mode)
- [ ] Export/Import des données (JSON)
- [ ] Recherche et filtres
- [ ] Dates d'échéance sur les cartes
- [ ] Backend avec API REST
- [ ] Authentification et multi-utilisateurs
- [ ] Collaboration en temps réel

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est développé dans le cadre d'un projet Epitech et est fourni à des fins éducatives.

---

## 👨‍💻 Auteur

**Étudiant Epitech**

- GitHub: [@ErwanRPS](https://github.com/ErwanRPS)
- Projet: EpiTrello

---

## 🙏 Remerciements

- [React](https://reactjs.org/) - Pour l'excellente bibliothèque UI
- [Vite](https://vitejs.dev/) - Pour la vitesse de développement
- [TailwindCSS](https://tailwindcss.com/) - Pour le système de design
- [Zustand](https://github.com/pmndrs/zustand) - Pour la gestion d'état simple
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) - Pour le drag & drop
- [Epitech](https://www.epitech.eu/) - Pour le projet et la formation

---

<div align="center">

**⭐ Si ce projet vous a été utile, n'oubliez pas de lui donner une étoile ! ⭐**

Made with ❤️ by Epitech Student

</div>
