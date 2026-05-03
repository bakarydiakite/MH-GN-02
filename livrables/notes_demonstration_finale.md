# Notes de démonstration — NaissanceChain

**MIABE Hackathon 2026 — Phase 2 Demi-finale**  
**Équipe :** MH GN-02  
**Projet :** NaissanceChain — Identité numérique & registres civils sur blockchain  
**Date :** 3 Mai 2026  
**Développeur :** Bakary Diakité

---

## Sommaire

1. Vision générale du projet
2. Acteurs simulés
3. Scénario de démonstration complet
4. Flux démontré
5. Réalisations techniques
6. Identifiants de test
7. Limites assumées du prototype
8. Roadmap et prochaines évolutions
9. Conclusion

---

## 1. Vision générale du projet

NaissanceChain est une solution numérique conçue pour améliorer l'enregistrement des naissances en Guinée, notamment dans les zones rurales où l'accès aux services d'état civil reste difficile.

Le projet répond à un problème majeur : de nombreux enfants ne disposent pas d'un acte de naissance officiel, ce qui limite leur accès à l'éducation, aux soins, à la protection juridique et aux documents d'identité.

Notre objectif est de proposer un écosystème simple, sécurisé et vérifiable, permettant :
- aux agents de santé ou d'état civil d'enregistrer les naissances depuis le terrain ;
- aux familles de consulter les actes numériques de leurs enfants ;
- aux écoles, hôpitaux et administrations de vérifier l'authenticité d'un acte ;
- à l'État, dans une version future, de mieux superviser les données d'état civil.

NaissanceChain combine une application mobile, un backend sécurisé, une base de données PostgreSQL et une preuve blockchain permettant de garantir l'intégrité des actes sans exposer les données personnelles.

---

## 2. Acteurs simulés

### 2.1 Agent BAKARY DIAKITE — Agent terrain

**Identité :**  
- Nom : Bakary Diakite  
- Rôle : Agent d'état civil / Agent de santé communautaire  
- Zone d'intervention : Rural, Préfecture de Labé

**Identifiants de connexion :**  
- Email : `agent@naissancechain.gn`  
- Mot de passe : `Agent@2026!`

### 2.2 M. et Mme DIALLO — Famille bénéficiaire

**Identité du père :**  
- Nom : Mamadou Diallo  
- Téléphone : `+224 620 00 00 01`

**Identité de la mère :**  
- Nom : Aminata Bah  
- Téléphone : `+224 620 00 00 02`

**Statut :** Famille rurale, sans Numéro d'Identification National, mais possédant un téléphone mobile.

**Responsabilités :**
- Consultation de l'espace famille
- Liaison des actes de leurs enfants via QR code
- Suivi du statut des demandes

---

### 2.3 Superviseur AMADOU CONDE — Autorité administrative

**Identité :**  
- Nom : Amadou Condé  
- Rôle : Officier d'état civil / Superviseur

**Identifiants de connexion :**  
- Email : `superviseur@naissancechain.gn`  
- Mot de passe : `Sup@2026!`

**Responsabilités :**
- Validation des dossiers soumis par les agents
- Vérification des informations
- Approbation ou rejet des enregistrements

---

### 2.4 Vérificateur institutionnel — École primaire de Labé

**Identité :**  
- Institution : École Primaire de Labé  
- Représentant : Directeur de l'école

**Responsabilités :**
- Vérification de l'authenticité des actes de naissance
- Validation des inscriptions scolaires

---

## 3. Scénario de démonstration complet

### Contexte

Nous sommes dans la préfecture de Labé, en Guinée. L'agent Bakary Diakite se rend dans un village rural pour enregistrer une naissance qui a eu lieu 3 jours plus tôt.

---

### ÉTAPE 1 : Connexion de l'Agent

**Acteur :** Agent Bakary Diakite

**Action :**  
L'agent ouvre l'application NaissanceChain sur son téléphone Android. Il arrive sur l'écran de connexion.

**Saisie des identifiants :**
```
Email : agent@naissancechain.gn
Mot de passe : Agent@2026!
```

**Résultat :**  
L'agent est authentifié avec succès. Il accède au tableau de bord agent qui affiche :
- Nombre d'enregistrements du jour : 0
- Enregistrements en attente de synchronisation : 0
- Bouton "Nouvel enregistrement"

---

### ÉTAPE 2 : Création d'un nouvel enregistrement

**Acteur :** Agent Bakary Diakite

**Action :**  
L'agent clique sur le bouton **"Nouvel enregistrement"**. Le formulaire s'ouvre en 6 étapes.

---

### ÉTAPE 3 : Saisie des informations de l'enfant

**Acteur :** Agent Bakary Diakite

**Données saisies :**

| Champ | Valeur |
|-------|--------|
| Nom de l'enfant | DIALLO |
| Prénom de l'enfant | Ibrahim |
| Sexe | Masculin |
| Date de naissance | 30/04/2026 |
| Lieu de naissance | Village de Sannou, Labé |
| Nationalité | Guinéenne |

**Action :**  
L'agent remplit les champs et clique sur **"Suivant"**.

---

### ÉTAPE 4 : Saisie des informations du père

**Acteur :** Agent Bakary Diakite

**Données saisies :**

| Champ | Valeur |
|-------|--------|
| Nom du père | DIALLO |
| Prénom du père | Mamadou |
| Téléphone | +224 620 00 00 01 |
| Nationalité | Guinéenne |
| Profession | Agriculteur |

**Action :**  
L'agent remplit les champs et clique sur **"Suivant"**.

---

### ÉTAPE 5 : Saisie des informations de la mère

**Acteur :** Agent Bakary Diakite

**Données saisies :**

| Champ | Valeur |
|-------|--------|
| Nom de la mère | BAH |
| Prénom de la mère | Aminata |
| Téléphone | +224 620 00 00 02 |
| Nationalité | Guinéenne |
| Profession | Ménagère |

**Action :**  
L'agent remplit les champs et clique sur **"Suivant"**.

---

### ÉTAPE 6 : Saisie des informations du déclarant

**Acteur :** Agent Bakary Diakite

**Données saisies :**

| Champ | Valeur |
|-------|--------|
| Nom du déclarant | DIALLO |
| Prénom du déclarant | Mamadou |
| Lien avec l'enfant | Père |
| Téléphone | +224 620 00 00 01 |

**Action :**  
L'agent remplit les champs et clique sur **"Suivant"**.

---

### ÉTAPE 7 : Localisation et informations administratives

**Acteur :** Agent Bakary Diakite

**Données saisies :**

| Champ | Valeur |
|-------|--------|
| Préfecture | Labé |
| Sous-préfecture | Labé Centre |
| Centre d'état civil | Centre Principal Labé |
| Date de déclaration | 03/05/2026 |

**Action :**  
L'agent utilise la géolocalisation automatique pour capturer les coordonnées GPS. Il clique sur **"Suivant"**.

---

### ÉTAPE 8 : Capture des pièces justificatives

**Acteur :** Agent Bakary Diakite

**Documents capturés :**

1. **Carnet de maternité** — Photo prise avec l'appareil photo du téléphone
2. **Pièce d'identité du père** — Photo du recto
3. **Attestation de naissance** — Document délivré par la maternité

**Action :**  
L'agent prend les photos des documents. Chaque photo est compressée et stockée localement. Il clique sur **"Soumettre"**.

---

### ÉTAPE 9 : Soumission et synchronisation

**Acteur :** Agent Bakary Diakite

**Scénario A — Connexion disponible :**

L'agent dispose d'une connexion internet (réseau mobile 3G).

**Actions automatiques :**
1. Les données sont envoyées vers le backend : `https://naissancechain-api.onrender.com`
2. Le backend enregistre les données dans PostgreSQL
3. Un hash SHA-256 est généré à partir des données
4. Le hash est ancré sur la blockchain Polygon Amoy
5. Un QR code est généré pour l'acte
6. Un message de confirmation s'affiche : **"Enregistrement réussi ! Acte n° LAB-2026-0001"**

**Scénario B — Mode hors-ligne :**

L'agent n'a pas de connexion internet.

**Actions automatiques :**
1. Les données sont sauvegardées localement sur le téléphone
2. Statut affiché : **"En attente de synchronisation"**
3. Dès que la connexion est rétablie, la synchronisation s'effectue automatiquement

---

### ÉTAPE 10 : Consultation par la famille

**Acteur :** M. Mamadou Diallo (Père)

**Action :**  
M. Diallo ouvre l'application NaissanceChain. Il choisit **"Espace Famille"**.

**Connexion :**
```
Numéro de téléphone : +224 620 00 00 01
Code OTP reçu : 123456
```

**Résultat :**  
M. Diallo accède à son tableau de bord famille. Initialement vide, il clique sur **"Lier un enfant"**.

**Liaison par QR code :**  
Il scanne le QR code que l'agent lui a imprimé ou affiché sur son téléphone.

**Résultat :**  
L'acte de naissance de **Ibrahim Diallo** apparaît dans son espace famille avec :
- Statut : **Enregistré**
- Numéro d'acte : LAB-2026-0001
- Date : 03/05/2026
- Preuve blockchain : Vérifiée ✓

---

### ÉTAPE 11 : Vérification institutionnelle

**Acteur :** Directeur de l'École Primaire de Labé

**Contexte :**  
La famille Diallo souhaite inscrire Ibrahim à l'école. Le directeur doit vérifier l'authenticité de l'acte de naissance.

**Action :**  
Le directeur accède au portail de vérification : `https://naissancechain.gn/verifier`

**Méthode 1 — Scan QR code :**  
Il scanne le QR code de l'acte avec son téléphone.

**Méthode 2 — Saisie manuelle :**  
```
Numéro d'acte : LAB-2026-0001
```

**Résultat :**  
Le système affiche :
- ✓ **Acte authentique**
- Hash blockchain vérifié
- Date d'ancrage : 03/05/2026
- Transaction : `0x7f8a...3b2c`

Le directeur peut alors valider l'inscription de l'enfant.

---

## 4. Flux démontré

### Diagramme du flux principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUX D'ENREGISTREMENT DE NAISSANCE                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   CONNEXION   │────▶│  FORMULAIRE  │────▶│   CAPTURE    │────▶│  SOUMISSION  │
│    AGENT      │     │   6 ÉTAPES   │     │  DOCUMENTS   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    FAMILLE    │◀────│   QR CODE    │◀────│  BLOCKCHAIN  │◀────│   BACKEND    │
│  CONSULTATION │     │   GÉNÉRÉ    │     │    ANCRAGE   │     │  POSTGRESQL  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  VÉRIFICATEUR │────▶│  INSCRIPTION │
│  INSTITUTION  │     │   SCOLAIRE   │
└──────────────┘     └──────────────┘
```

---

### Flux détaillé étape par étape

#### Phase 1 : Enregistrement terrain

| Étape | Acteur | Action | Résultat |
|-------|--------|--------|----------|
| 1 | Agent | Connexion à l'application | Accès au tableau de bord |
| 2 | Agent | Saisie infos enfant | Données stockées localement |
| 3 | Agent | Saisie infos parents | Données stockées localement |
| 4 | Agent | Saisie infos déclarant | Données stockées localement |
| 5 | Agent | Géolocalisation | Coordonnées GPS capturées |
| 6 | Agent | Capture documents | Photos compressées |
| 7 | Agent | Soumission | Données envoyées au backend |

#### Phase 2 : Traitement backend

| Étape | Système | Action | Résultat |
|-------|---------|--------|----------|
| 8 | Backend | Réception des données | Données validées |
| 9 | Backend | Enregistrement PostgreSQL | Acte créé avec ID unique |
| 10 | Backend | Génération hash SHA-256 | Empreinte cryptographique |
| 11 | Backend | Ancrage blockchain | Transaction envoyée |
| 12 | Backend | Génération QR code | QR code lié à l'acte |

#### Phase 3 : Consultation famille

| Étape | Acteur | Action | Résultat |
|-------|--------|--------|----------|
| 13 | Famille | Connexion espace famille | Accès au tableau de bord |
| 14 | Famille | Scan QR code | Enfant lié au compte |
| 15 | Famille | Consultation acte | Détails visibles |

#### Phase 4 : Vérification institutionnelle

| Étape | Acteur | Action | Résultat |
|-------|--------|--------|----------|
| 16 | Institution | Accès portail vérification | Formulaire de vérification |
| 17 | Institution | Scan QR ou saisie ID | Recherche dans la base |
| 18 | Système | Vérification hash | Comparaison blockchain |
| 19 | Système | Affichage résultat | Acte authentique ✓ |

---

### Flux de données

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE TECHNIQUE                        │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│   APPLICATION │────────▶│    BACKEND    │────────▶│  POSTGRESQL   │
│    MOBILE     │   API    │   Node.js     │   ORM    │   Database    │
│  React Native │  REST    │   Express     │         │               │
└───────────────┘         └───────────────┘         └───────────────┘
                                  │
                                  │ Hash SHA-256
                                  ▼
                          ┌───────────────┐
                          │  BLOCKCHAIN   │
                          │  Polygon Amoy │
                          │   (Testnet)   │
                          └───────────────┘
                                  │
                                  │ Preuve
                                  ▼
                          ┌───────────────┐
                          │   VÉRIFICATEUR │
                          │   Portail Web │
                          └───────────────┘
```

---

## 5. Réalisations techniques

### 5.1 Application mobile

| Fonctionnalité | Statut |
|----------------|--------|
| Authentification agent | ✅ Implémenté |
| Formulaire 6 étapes | ✅ Implémenté |
| Capture de documents | ✅ Implémenté |
| Mode hors-ligne | ✅ Implémenté |
| Géolocalisation | ✅ Implémenté |
| Espace famille | ✅ Implémenté |
| Scan QR code | ✅ Implémenté |

### 5.2 Interface web

| Fonctionnalité | Statut |
|----------------|--------|
| Tableau de bord admin | ✅ Implémenté |
| Visualisation des actes | ✅ Implémenté |
| Statistiques | ✅ Implémenté |
| Portail de vérification | ✅ Implémenté |

### 5.3 Backend et blockchain

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js / Express / NestJS |
| Base de données | PostgreSQL |
| Blockchain | Polygon Amoy (testnet) |
| Stockage fichiers | Supabase Storage |
| Authentification | Supabase Auth |

**URL API :** `https://naissancechain-api.onrender.com`

---

## 6. Identifiants de test

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Agent | agent@naissancechain.gn | Agent@2026! |
| Superviseur | superviseur@naissancechain.gn | Sup@2026! |
| Administrateur | admin@naissancechain.gn | Admin@2026! |

### Accès famille

| Famille | Téléphone | Code OTP (test) |
|---------|-----------|-----------------|
| Famille Diallo | +224 620 00 00 01 | 123456 |

---

## 7. Limites assumées du prototype

| Limite | Description |
|--------|-------------|
| Session appetize.io | 2-3 minutes (plan gratuit) |
| Backend sleep | Première connexion lente après inactivité |
| Superviseur | Non intégré comme étape obligatoire |
| Biométrie | Non disponible sur émulateur web |

---

## 8. Roadmap et prochaines évolutions

### Version 2.0

- [ ] Intégration du superviseur administratif (validation avant ancrage)
- [ ] Portail institutionnel complet
- [ ] Amélioration du mode hors-ligne

### Version 3.0

- [ ] Audit assisté par IA
- [ ] Biométrie encadrée
- [ ] Intégration avec le système d'état civil national

---

## 9. Conclusion

Cette démonstration montre que NaissanceChain propose un parcours fonctionnel complet :

✓ Enregistrement mobile par l'agent terrain  
✓ Synchronisation avec le backend  
✓ Preuve blockchain pour l'intégrité  
✓ Accès famille via QR code  
✓ Vérification institutionnelle

NaissanceChain répond à un besoin réel en Guinée : **réduire l'invisibilité juridique des enfants et faciliter leur accès aux droits fondamentaux.**

---

**Chaque naissance enregistrée est un enfant qui existe.**

---

## Contact

**Développeur :** Bakary Diakité  
**Email :** bakarydiakite365@gmail.com  
**Équipe :** MH GN-02

---

*Document généré pour le MIABE HACKathon — Mai 2026*
