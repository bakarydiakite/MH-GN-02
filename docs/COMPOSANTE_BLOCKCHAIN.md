# Composante Blockchain : NaissanceChain ⛓️

Ce document détaille l'intégration technique de la blockchain au sein du projet **NaissanceChain**, conformément aux exigences de la Phase 1 du MIABE Hackathon 2026.

## 1. Choix du Réseau : Polygon Amoy (Testnet)

Pour garantir la résilience et la sécurité du registre d'état civil guinéen, nous utilisons le réseau **Polygon Amoy**.

*   **Type de Réseau** : Layer 2 Scaling Solution basé sur Ethereum.
*   **Consensus** : Proof-of-Stake (PoS) — écologique et rapide.
*   **Performance** : Temps de bloc de ~2 secondes, permettant une validation quasi-instantanée des naissances par l'administration.
*   **Coût** : Frais de transaction (gaz) extrêmement faibles (fractions de centimes), ce qui rend le système viable à l'échelle nationale pour des millions d'enfants.

---

## 2. Enregistrement de l'Acte (Processus d'Ancrage)

L'enregistrement d'une naissance suit une chaîne de confiance rigoureuse pour garantir l'immuabilité sans compromettre la vie privée.

1.  **Génération de l'Empreinte (Hashing)** : Dès que l'agent synchronise les données sur le serveur, le système extrait les données pivots (IUN, Nom, Date de Naissance) et génère un **Hash cryptographique SHA-256**.
2.  **Ancrage sur Smart Contract** : Ce Hash est envoyé automatiquement via une transaction vers un Smart Contract déployé sur Polygon Amoy après un contrôle électronique d'intégrité par le backend. 
3.  **Confidentialité Totale** : **Aucune donnée personnelle** (nom, prénom, photo) n'est stockée sur la blockchain. Seul le Hash (l'empreinte) y figure. Il est impossible de retrouver l'identité d'un enfant à partir de la blockchain seule, mais il est possible de prouver que son acte est authentique.
4.  **Transaction Hash** : L'identifiant de la transaction blockchain est sauvegardé dans notre base de données sécurisée pour servir de passerelle de preuve.

---

## 3. Mécanisme de Vérification

Toute institution (école, hôpital, tribunal) peut vérifier l'authenticité d'un acte de naissance en 3 étapes :

1.  **Récupération des Données** : L'institution scanne le QR code de l'acte numérique, ce qui récupère les données originales depuis notre API sécurisée.
2.  **Re-calcul du Hash** : Le portail de vérification re-calcule localement le Hash SHA-256 à partir de ces données.
3.  **Appel Blockchain** : Le portail interroge le Smart Contract pour vérifier si ce Hash a bien été ancré à la date de validation déclarée.
    *   **Succès** : "Document Authentique" — La garantie blockchain prouve que les données n'ont jamais été modifiées depuis leur validation initiale.
    *   **Échec** : "Alerte Falsification" — Si une seule virgule a été modifiée dans le document, le Hash ne correspondra plus.

---

## 4. Gestion du Mode Hors-ligne (Offline Management)

La blockchain ne nécessite pas que l'agent de terrain soit connecté lors de la capture des données. 

*   **Capture Mobile** : L'agent de santé saisit les données dans l'application Android en zone blanche. Les données sont stockées dans une base de données locale chiffrée.
*   **Validation Automatique** : L'ancrage blockchain ne se produit **jamais sur le téléphone**. Il est délégué au serveur backend (NestJS) qui prend le relais dès la réception des données.
*   **Synchronisation en File d'Attente (Sync Queue)** : Dès que l'agent retrouve du réseau, les dossiers sont envoyés au serveur. Une fois synchronisées, les naissances sont certifiées et ancrées immédiatement par lot ou individuellement sur la blockchain Polygon.
*   **Audit a posteriori** : Les superviseurs peuvent contrôler les enregistrements via le portail web après leur certification, assurant un contrôle qualité continu sans ralentir le processus d'identification.
*   **Résilience** : En cas de panne réseau au moment de l'ancrage, le système de retry automatique garantit que chaque naissance finit par être ancrée sur la chaîne, sans risque de doublon (idempotence).

---

> **NaissanceChain** : Chaque naissance enregistrée sur la blockchain est un enfant qui existe pour toujours, protégé contre la perte ou la destruction des archives papier traditionnelles.
