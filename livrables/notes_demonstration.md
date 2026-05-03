# Notes sur la Démonstration - NaissanceChain

## MIABE HACKathon - Demi-Finale

**Date:** 3 Mai 2026  
**Équipe:** Bakary Diakité  
**Projet:** NaissanceChain - Système de gestion des déclarations de naissance

---

## 1. Description du Prototype

NaissanceChain est une application mobile de gestion des déclarations de naissance au Mali. Elle permet de digitaliser et sécuriser le processus de déclaration de naissance grâce à la blockchain.

### Fonctionnalités principales:
- **Authentification** des utilisateurs (Administrateur, Superviseur, Vérificateur, Agent, Famille)
- **Déclaration de naissance** avec saisie des informations de l'enfant et des parents
- **Géolocalisation** des centres d'état civil
- **Upload de documents** (actes de naissance, pièces d'identité)
- **Biometrie** (authentification par empreinte digitale)
- **Interface multilingue** (Français, Bambara)

---

## 2. Acteurs Simulés

### A. Agent d'État Civil
- **Rôle:** Enregistrement des déclarations de naissance
- **Actions simulées:**
  - Connexion à l'application
  - Saisie des informations de naissance
  - Validation des documents

### B. Famille
- **Rôle:** Demande de déclaration de naissance
- **Actions simulées:**
  - Inscription sur la plateforme
  - Soumission des documents
  - Suivi du statut de la demande

### C. Superviseur
- **Rôle:** Validation et supervision des déclarations
- **Actions simulées:**
  - Vérification des déclarations
  - Approbation ou rejet des demandes

### D. Administrateur
- **Rôle:** Gestion du système
- **Actions simulées:**
  - Gestion des utilisateurs
  - Configuration des centres d'état civil

---

## 3. Flux Démontré

### Flux 1: Déclaration de Naissance (Principal)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Connexion  │───▶│  Saisie     │───▶│  Upload     │───▶│  Validation │
│  Agent      │    │  Infos      │    │  Documents  │    │  Superviseur │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
                                                        ┌─────────────┐
                                                        │  Enregistre-│
                                                        │  ment Final │
                                                        └─────────────┘
```

#### Étapes détaillées:
1. **Connexion** - L'agent se connecte avec son email et mot de passe
2. **Saisie des informations** - Remplissage du formulaire:
   - Nom et prénom de l'enfant
   - Date et lieu de naissance
   - Informations des parents
   - Sexe de l'enfant
3. **Upload des documents** - Ajout des pièces justificatives
4. **Soumission** - Envoi de la déclaration
5. **Validation** - Le superviseur vérifie et approuve
6. **Enregistrement** - Génération de l'acte de naissance

### Flux 2: Consultation par la Famille

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Inscription│───▶│  Connexion  │───▶│  Suivi      │
│  Famille    │    │             │    │  Demande    │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 4. Architecture Technique

### Backend
- **URL:** https://naissancechain-api.onrender.com
- **Technologie:** Node.js / Express / NestJS
- **Base de données:** PostgreSQL
- **Blockchain:** Intégration pour la sécurité des actes

### Frontend Mobile
- **Framework:** React Native + Expo SDK 54
- **Navigation:** React Navigation
- **Style:** NativeWind (TailwindCSS)
- **État:** React Context API

### Services intégrés
- **Supabase:** Authentification et stockage
- **Google Sign-In:** Connexion OAuth
- **Expo Location:** Géolocalisation des centres
- **Expo Camera:** Capture de documents

---

## 5. Identifiants de Test

Pour la démonstration, utilisez les comptes suivants:

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Agent | agent@test.com | Test123! |
| Superviseur | superviseur@test.com | Test123! |
| Admin | admin@test.com | Admin123! |

---

## 6. Points Clés de la Démonstration

1. **Simplicité d'utilisation** - Interface intuitive en français
2. **Sécurité** - Authentification biométrique disponible
3. **Traçabilité** - Historique des actions consultable
4. **Accessibilité** - Fonctionne hors-ligne (mode dégradé)
5. **Décentralisation** - Stockage sécurisé sur blockchain

---

## 7. Limitations Connues

- Session limitée à 2-3 minutes sur appetize.io (plan gratuit)
- Backend en mode "sleep" après inactivité (première connexion peut être lente)
- Certaines fonctionnalités biométriques non disponibles sur l'émulateur web

---

## 8. Contact

**Développeur:** Bakary Diakité  
**Email:** bakarydiakite365@gmail.com  
**GitHub:** [Lien du dépôt]

---

*Document généré pour le MIABE HACKathon - Mai 2026*
