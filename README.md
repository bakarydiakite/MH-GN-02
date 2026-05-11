# 🌍 NaissanceChain

<div align="center">

**Identité numérique & Registres civils sur Blockchain**

*Solution numérique pour l'enregistrement des naissances en Guinée*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-blue)](https://reactnative.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red)](https://nestjs.com/)
[![Blockchain](https://img.shields.io/badge/Polygon-Amoy-purple)](https://polygon.technology/)

</div>

---

## 📋 Description du Projet

**NaissanceChain** est une solution numérique innovante conçue pour améliorer l'enregistrement des naissances en Guinée, notamment dans les zones rurales où l'accès aux services d'état civil reste difficile.

### 🎯 Problème résolu

De nombreux enfants en Guinée ne disposent pas d'un acte de naissance officiel, ce qui limite leur accès à :
- 📚 L'éducation
- 🏥 Les soins de santé
- ⚖️ La protection juridique
- 🪪 Les documents d'identité

### ✨ Notre solution

Un écosystème complet permettant :
- 👨‍⚕️ Aux **agents de santé** d'enregistrer les naissances depuis le terrain
- 👨‍👩‍👧 Aux **familles** de consulter les actes numériques de leurs enfants
- 🏫 Aux **institutions** de vérifier l'authenticité des actes
- 🏛️ À l'**État** de mieux superviser les données d'état civil

---

## 🏗️ Architecture du Projet

```
naissancechain/
├── 📱 mobile/          # Application mobile React Native (Expo)
├── 🌐 Frontend/        # Interface web React (Vite)
├── ⚙️ backend/         # API NestJS + PostgreSQL
├── ⛓️ blockchain/      # Smart Contracts (Hardhat)
├── 📁 docs/            # Documentation technique
└── 📦 livrables/       # Fichiers pour le hackathon
```

### Architecture Technique

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NAISSANCECHAIN                               │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   APPLICATION │     │    FRONTEND   │     │    BACKEND    │
│    MOBILE     │     │     REACT     │     │    NESTJS     │
│ React Native  │     │     Vite      │     │   PostgreSQL  │
│    Expo       │     │  TailwindCSS  │     │     Prisma    │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              ▼
                    ┌───────────────┐
                    │  BLOCKCHAIN   │
                    │ Polygon Amoy  │
                    │  (Testnet)    │
                    └───────────────┘
```

---

## 🛠️ Technologies Utilisées

### 📱 Application Mobile
| Technologie | Version | Description |
|-------------|---------|-------------|
| React Native | 0.81.5 | Framework mobile cross-platform |
| Expo SDK | 54.0.0 | Plateforme de développement |
| NativeWind | 4.2.3 | TailwindCSS pour React Native |
| React Navigation | 7.x | Navigation mobile |
| React Native Reanimated | 4.1.1 | Animations fluides |
| Supabase | 2.x | Authentification & stockage |

### 🌐 Frontend Web
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.3.1 | Bibliothèque UI |
| Vite | 5.4.2 | Build tool |
| TailwindCSS | 3.4.1 | Framework CSS |
| Framer Motion | 12.x | Animations |
| React Router | 7.x | Routing |

### ⚙️ Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| NestJS | 11.0.1 | Framework Node.js |
| Prisma | 7.7.0 | ORM |
| PostgreSQL | - | Base de données |
| Passport JWT | 4.0.1 | Authentification |
| Ethers.js | 6.16.0 | Interaction blockchain |
| QRCode | 1.5.4 | Génération QR codes |

### ⛓️ Blockchain
| Technologie | Description |
|-------------|-------------|
| Solidity | Smart contracts |
| Hardhat | Environnement de développement |
| Polygon Amoy | Testnet utilisé |

---

## 🚀 Installation et Utilisation

### Prérequis

- Node.js >= 18.x
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Compte Supabase (pour l'authentification)

### 📱 Installation Mobile

```bash
# Cloner le repository
git clone https://github.com/votre-username/naissancechain.git
cd naissancechain/mobile

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Lancer l'application
npx expo start
```

### 🌐 Installation Frontend

```bash
cd naissancechain/Frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

### ⚙️ Installation Backend

```bash
cd naissancechain/backend

# Installer les dépendances
npm install

# Configurer la base de données
npx prisma generate
npx prisma db push

# Configurer les variables d'environnement
cp .env.example .env

# Lancer en développement
npm run start:dev
```

### ⛓️ Déploiement Blockchain

```bash
cd naissancechain/blockchain

# Installer les dépendances
npm install

# Compiler les contracts
npx hardhat compile

# Déployer sur testnet
npx hardhat run scripts/deploy.js --network amoy
```

---

## ✅ Fonctionnalités Principales

### 👨‍⚕️ Espace Agent
- ✅ Authentification sécurisée
- ✅ Enregistrement de naissances (formulaire 6 étapes)
- ✅ Capture de documents justificatifs
- ✅ Mode hors-ligne avec synchronisation
- ✅ Géolocalisation des centres d'état civil
- ✅ Génération de QR codes

### 👨‍👩‍👧 Espace Famille
- ✅ Connexion par numéro de téléphone
- ✅ Liaison d'enfants via QR code
- ✅ Consultation des actes de naissance
- ✅ Suivi du statut des demandes

### 🏫 Portail de Vérification
- ✅ Vérification d'authenticité par QR code
- ✅ Vérification par numéro d'acte
- ✅ Validation blockchain

### 📊 Dashboard Administratif
- ✅ Visualisation des statistiques
- ✅ Gestion des utilisateurs
- ✅ Suivi des enregistrements

### ⛓️ Blockchain
- ✅ Ancrage cryptographique des actes
- ✅ Preuve d'intégrité (hash SHA-256)
- ✅ Vérification décentralisée

---

## 📁 Structure du Projet

### Mobile (`/mobile`)

```
mobile/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── screens/          # Écrans de l'application
│   │   ├── auth/         # Authentification
│   │   ├── dashboard/    # Tableau de bord
│   │   ├── family/       # Espace famille
│   │   ├── records/      # Enregistrements
│   │   └── profile/      # Profil utilisateur
│   ├── services/         # Services API
│   ├── navigation/       # Configuration navigation
│   ├── store/            # État global (Context)
│   ├── theme/            # Thèmes et styles
│   └── utils/            # Utilitaires
├── assets/               # Images, fonts, etc.
├── App.tsx               # Point d'entrée
└── app.json              # Configuration Expo
```

### Frontend (`/Frontend`)

```
Frontend/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── features/         # Fonctionnalités par domaine
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services API
│   └── main.tsx          # Point d'entrée
├── public/               # Fichiers statiques
└── index.html            # HTML principal
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── modules/          # Modules métier
│   │   ├── auth/         # Authentification
│   │   ├── births/       # Enregistrements naissance
│   │   ├── blockchain/   # Interaction blockchain
│   │   ├── certificates/ # Certificats
│   │   └── stats/        # Statistiques
│   ├── shared/           # Éléments partagés
│   ├── app.module.ts     # Module principal
│   └── main.ts           # Point d'entrée
├── prisma/               # Schéma base de données
├── contracts/            # Smart contracts
└── test/                 # Tests
```

---

## 🔐 Sécurité

- **Authentification** : JWT + Supabase Auth
- **Stockage** : Chiffrement des données sensibles
- **Blockchain** : Preuve cryptographique sans exposition des données personnelles
- **Hors-ligne** : Stockage local sécurisé

---

## 🧪 Tests

```bash
# Tests backend
cd backend
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📱 Démo

### Prototype en ligne
🔗 **[Tester sur appetize.io](https://appetize.io/app/b_mdnrmjw5vyq3iwuskugprq7wna)**

### Identifiants de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Agent | agent@naissancechain.gn | Agent@2026! |
| Superviseur | superviseur@naissancechain.gn | Sup@2026! |
| Admin | admin@naissancechain.gn | Admin@2026! |

---

## 📖 Documentation

- [Analyse du problème](./docs/ANALYSE_PROBLEME_GUINEE.md)
- [Architecture blockchain](./docs/COMPOSANTE_BLOCKCHAIN.md)
- [Notes de démonstration](./livrables/notes_demonstration_finale.md)

---

## 👥 Équipe

**MH GN-02** - MIABE Hackathon 2026

- **Développeur** : Bakary Diakité
- **Email** : bakarydiakite365@gmail.com

---

## 🗓️ Roadmap

### Phase 2 (Actuelle)
- [x] Application mobile fonctionnelle
- [x] Backend API
- [x] Intégration blockchain
- [x] Mode hors-ligne

### Phase 3 (Prochaine)
- [ ] Validation par superviseur
- [ ] Portail institutionnel complet
- [ ] Amélioration mode hors-ligne

### Phase 4 (Futur)
- [ ] Audit assisté par IA
- [ ] Biométrie encadrée
- [ ] Intégration système national

---

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Chaque naissance enregistrée est un enfant qui existe.**

🌍 *NaissanceChain - MIABE Hackathon 2026*

</div>









 Recommandation : Approche 2 avec validation
Pourquoi ?
1. Conformité légale et administrative
L'état civil est un acte juridique officiel. Dans tous les pays, un officier d'état civil doit valider les déclarations avant qu'elles ne deviennent officielles.

Exemples internationaux :

🇫🇷 France : Officier d'état civil valide
🇧🇫 Burkina Faso : Chef de centre valide
🇸énégal Sénégal : Officier d'état civil valide
2. Prévention des erreurs
Un agent terrain peut faire des erreurs de saisie (nom mal orthographié, date incorrecte). Une fois sur la blockchain, ces erreurs sont permanentes.

Exemple d'erreur critique :

Enfant : "Ibrahima Diallo" → Erreur de saisie → "Ibrahima Dallo"
→ Blockchain : Impossible à corriger sans procédure complexe
3. Prévention des fraudes
Sans validation, un agent malveillant pourrait :

Créer de faux actes
Enregistrer des enfants fantômes
Modifier des données
4. Chaîne de responsabilité claire
Agent : Responsable de la collecte
Superviseur : Responsable de la validation
Système : Responsable de l'intégrité (blockchain)
📋 Architecture Recommandée
Workflow optimal
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW D'ENREGISTREMENT OPTIMAL                        │
└─────────────────────────────────────────────────────────────────────────────┘
 
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   ÉTAPE 1    │────▶│   ÉTAPE 2    │────▶│   ÉTAPE 3    │────▶│   ÉTAPE 4    │
│   AGENT      │     │  EN ATTENTE  │     │ SUPERVISEUR  │     │ BLOCKCHAIN   │
│              │     │              │     │              │     │              │
│ - Collecte   │     │ - Vérification│    │ - Valide OU  │     │ - Preuve     │
│ - Saisie     │     │ - Contrôle    │     │ - Rejette    │     │ - Hash       │
│ - Documents  │     │ - Qualité     │     │ - Commentaire│    │ - TxHash     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            │                     ▼
                            │              ┌──────────────┐
                            │              │   REJETÉ     │
                            │              │ - Retour à   │
                            │              │   l'agent    │
                            │              │ - Correction │
                            │              └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  HORS-LIGNE  │
                     │ - Stockage   │
                     │   local      │
                     │ - Synchro    │
                     │   ultérieure │
                     └──────────────┘
États du dossier
Statut	Description	Action suivante
BROUILLON	En cours de saisie par l'agent	Continuer la saisie
COMPLET	Saisie terminée, en local	Synchroniser
EN_ATTENTE	Synchronisé, attend validation	Superviseur vérifie
VALIDE	Validé par superviseur	Ancrage blockchain
REJETE	Rejeté par superviseur	Agent corrige
SYNCHRONISE	Ancré sur blockchain	Terminé
💡 Solution Hybride (Recommandée)
Mode Normal (zones urbaines)
Agent → Superviseur → Blockchain
Mode Dégradé (zones rurales sans connexion)
Agent → Stockage local → (connexion) → Superviseur → Blockchain
Mode Urgence (cas exceptionnels)
Agent → Blockchain direct → Superviseur vérifie a posteriori
Uniquement pour les naissances à risque (accouchement à domicile, urgence médicale)

🔧 Implémentation Technique
Base de données
sql
-- Table birth_record
statut ENUM('BROUILLON', 'COMPLET', 'EN_ATTENTE', 'VALIDE', 'REJETE', 'SYNCHRONISE')
 
-- Nouveaux champs
validated_by VARCHAR -- ID du superviseur
validated_at TIMESTAMP
rejection_reason TEXT
API Endpoints
typescript
// Agent soumet
POST /births → statut: EN_ATTENTE
 
// Superviseur valide
POST /births/:id/validate → statut: VALIDE → Blockchain
 
// Superviseur rejette
POST /births/:id/reject → statut: REJETE + motif
📊 Comparaison finale
Critère	Direct (Approche 1)	Validé (Approche 2)
Rapidité	⭐⭐⭐⭐⭐	⭐⭐⭐
Sécurité	⭐⭐	⭐⭐⭐⭐⭐
Conformité légale	⭐	⭐⭐⭐⭐⭐
Prévention fraude	⭐⭐	⭐⭐⭐⭐⭐
Contrôle qualité	⭐	⭐⭐⭐⭐⭐
Coût ressources	⭐⭐⭐⭐⭐	⭐⭐⭐
Adapté gouvernement	❌	✅
🎯 Conclusion
Pour un projet gouvernemental d'état civil, l'Approche 2 (avec validation) est obligatoire.

Raisons principales :
Exigence légale - Les actes d'état civil nécessitent une validation officielle
Intégrité des données - La blockchain est immuable, les erreurs sont permanentes
Confiance publique - Les citoyens doivent avoir confiance dans les actes officiels
Standard international - Tous les systèmes d'état civil modernes ont une validation
Votre projet actuel
Votre prototype (Approche 1) est acceptable pour une démonstration mais devra évoluer vers l'Approche 2 pour un déploiement réel.

C'est d'ailleurs ce que vous avez prévu dans votre roadmap :

Phase 3 : Validation par superviseur ✅

Feedback submitted
    