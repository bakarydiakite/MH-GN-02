# Notes de Démonstration - NaissanceChain (PHASE 2 DEMI-FINALE)

## 👤 Acteurs Simulés
1. **Agent CAMARA** : Agent de santé communautaire basé dans un centre de santé rural. Il utilise l'application pour enregistrer les naissances, souvent dans des conditions de connexion limitée.
2. **M. et Mme DIALLO** : Parents résidant en zone rurale. Ils ne possèdent pas de carte d'identité nationale (NIN), mais disposent d'un smartphone et d'un numéro de téléphone.

## 🔄 Flux de Démonstration (Scénario)

### Étape 1 : Enregistrement "Offline-First" (Agent Camara)
*   **Action** : L'agent Camara ouvre l'application en "Mode Avion" (simulant une zone blanche).
*   **Saisie** : Il remplit les 5 étapes du formulaire de naissance pour l'enfant **Bakary Diallo**.
*   **Preuves** : Il prend en photo le carnet de maternité et la CNI de la mère.
*   **Résultat** : L'enregistrement est sauvegardé localement en tant que **Brouillon**. L'agent voit une notification indiquant "En attente de synchronisation".

### Étape 2 : Synchronisation Automatique et Blockchain
*   **Action** : La connexion internet est rétablie.
*   **Magie** : L'application détecte le réseau et lance la synchronisation en arrière-plan sans intervention de l'agent.
*   **Preuve Blockchain** : Les données sont envoyées au backend, hachées, et ancrées sur la blockchain **Polygon Amoy**. Un Identifiant Unique National (IUN) est généré.

### Étape 3 : Liaison Famille par QR Code (Famille Diallo)
*   **Action** : M. Diallo télécharge l'application et crée un compte "Famille" avec son numéro de téléphone. Son espace est initialement vide (0 enfant).
*   **Liaison** : Il utilise la fonction "Lier un enfant" et scanne le QR Code présent sur l'acte de naissance papier remis par l'agent.
*   **Résultat** : Bakary Diallo apparaît instantanément dans son tableau de bord. Il peut désormais consulter l'acte numérique et suivre son dossier.

## 🛠️ Points Forts Techniques Démontrés
*   **Robustesse Offline** : Capacité à travailler sans réseau.
*   **Inclusion Numérique** : Liaison parent-enfant sans besoin de NIN obligatoire, via QR Code/Téléphone.
*   **Transparence Blockchain** : Chaque acte est vérifiable via un explorateur de blocs, garantissant l'absence de fraude.
