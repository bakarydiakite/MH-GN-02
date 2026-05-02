# Vision Technique : La Composante Blockchain et Résilience ⛓️

## 1. Cycle de Vie d'un Enregistrement

Le système **NaissanceChain** assure une chaîne de confiance ininterrompue, de la naissance physique à l'identité numérique immuable.

### Étape 1 : Saisie Terrain (Mode Offline First)
*   **Action** : L'agent de santé saisit les données sur l'application mobile.
*   **Technique** : Les données sont stockées localement dans une base **SQLite chiffrée (AES-256)** sur le terminal mobile.
*   **Résilience** : L'application ne nécessite aucune connexion internet pour cette étape. Un identifiant de brouillon unique est généré localement.

### Étape 2 : Synchronisation et Transit
*   **Action** : Dès qu'un réseau (3G/4G/Wi-Fi) est détecté, l'application synchronise les dossiers.
*   **Technique** : Payload JSON compressé envoyé via **HTTPS/TLS 1.3** vers l'API NestJS. L'API valide l'intégrité et le format des données.

### Étape 3 : Validation Administrative
*   **Action** : Un superviseur du Ministère examine le dossier sur le portail web.
*   **Technique** : Le dossier passe du statut `EN_ATTENTE` à `VALIDE`.

### Étape 4 : Ancrage Blockchain et Génération de l'Acte
*   **Le Processus d'Ancrage** :
    1.  Le système génère un document PDF officiel (l'acte numérique).
    2.  Un **Hash cryptographique (SHA-256)** est calculé à partir du contenu de l'acte et de l'Identifiant Unique National (IUN).
    3.  Ce Hash est envoyé dans une transaction sur la **Blockchain (Polygon/Base)**.
    4.  L'adresse de la transaction est stockée dans la base de données PostgreSQL.
*   **Données Sensibles** : Aucune donnée personnelle (nom, date, lieu) n'est stockée sur la blockchain. Seule l'empreinte numérique (le hash) y figure, garantissant la confidentialité.

---

## 2. Mécanisme de Vérification

Toute institution autorisée (école, hôpital, administration) peut vérifier l'authenticité d'un acte en quelques secondes :

1.  **Scan du QR Code** : Le QR code présent sur l'acte contient un lien vers le portail de vérification et l'IUN.
2.  **Re-calcul du Hash** : Le portail récupère les données originales de la base de données sécurisée et recalcule le Hash.
3.  **Comparaison Blockchain** : Le portail interroge la blockchain pour vérifier que le Hash stocké à l'IUN correspondant correspond exactement au Hash calculé.
4.  **Verdict** : 
    *   *Match* : "Acte Authentique et Inchangé".
    *   *No Match* : "Tentative de falsification détectée".

---

## 3. Gestion de la Résilience Offline

Le mode hors-ligne est au cœur de la conception technique :
*   **Stockage Persistant** : Utilisation d'une file d'attente (Sync Queue) sur mobile. Si une synchronisation échoue, le système réessaye automatiquement lors de la prochaine fenêtre de connectivité.
*   **Validation Locale** : Les règles métier de base sont implémentées sur le mobile pour éviter les erreurs de saisie avant même la synchronisation.
*   **Identifiants Déterministes** : Utilisation possible d'UUIDs pour éviter les collisions lors de la fusion des données provenant de milliers d'agents différents.

---

**NaissanceChain** transforme la blockchain d'un concept abstrait en un outil de protection civile concret.
