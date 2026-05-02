# Dossier d'Impact - NaissanceChain (Phase 1)
🇬🇳 **Souveraineté Numérique & État Civil en Guinée**

## 1. Analyse de la Problématique
La Guinée traverse une "crise silencieuse" de l'identité. Malgré les efforts de modernisation, une part significative de la population reste hors des registres officiels.

### 1.1 Données Clés (Source: UNICEF/INS 2022)
- **Taux National d'Enregistrement** : environ **58%**.
- **Enfants Invisibles** : **1,8 million** d'enfants de moins de 18 ans n'existent pas juridiquement.
- **Le Fossé Urbain/Rural** :
    - **Conakry** : Taux proche de **80%**.
    - **Zones Rurales** (Moyenne/Haute Guinée & Guinée Forestière) : Taux s'effondrant à **moins de 40%**.
- **Délais** : Obtenir un certificat "tardif" prend entre **3 et 8 mois** en raison des déplacements complexes.

### 1.2 Les Conséquences du "Non-Enregistrement"
Un enfant sans identité numérique ou physique subit une triple exclusion :
1. **Exclusion Éducative** : Sans acte de naissance, les chances de scolarisation chutent de **35%**. L'inscription au baccalauréat et aux examens nationaux est impossible.
2. **Exclusion Sanitaire** : Accès limité aux soins subventionnés et aux programmes de vaccination nationaux.
3. **Exclusion Civique** : Incapacité future à voter, à obtenir un passeport ou à posséder un compte bancaire, alimentant le cycle de la pauvreté.

---

## 2. La Vision NaissanceChain
Notre solution vise à inverser cette tendance en apportant l'état civil directement dans les maternités et les foyers les plus reculés.

### 2.1 Objectif Impact
- **Cible** : Couverture de **100%** des naissances dans les 24h suivant l'accouchement.
- **Réduction des coûts** : Diminution drastique des frais de déplacement pour les familles.
- **Pérennité** : Sauvegarde indestructible sur la Blockchain Polygon (Anchoring), protégée contre les incendies ou inondations des centres d'archives physiques.

---

## 3. Composante Blockchain & Vérification

### 3.1 Comment l'acte est-il enregistré ?
1. **Saisie Locale** : L'agent (sage-femme/agent d'état civil) saisit les données sur l'app (même sans internet).
2. **Ancrage (Hashing)** : Un hachage SHA-256 de l'acte est généré localement.
3. **Synchronisation** : Dès que l'agent retrouve du réseau, l'acte est envoyé au serveur et le hash est ancré sur la blockchain Polygon (Mainnet/Testnet).
4. **Preuve d'Immuabilité** : La transaction blockchain sert de "tampon temporel" infalsifiable.

### 3.2 Comment fonctionne la vérification ?
Toute institution (école, hôpital, tribunal) peut scanner le **QR Code** présent sur l'acte numérique. 
- Le système compare le hash actuel avec celui stocké sur la blockchain.
- Résultat Instantané : "Vérifié" ou "Invalide/Modifié".

### 3.3 Gestion du Mode Hors-Ligne
- **Base de données SQLite chiffrée** sur l'appareil.
- **File d'attente de synchronisation** persistante.
- L'identifiant national est pré-réservé en local pour garantir l'unicité même sans connexion immédiate.

---

## 4. Annexes Visuelles
- **Maquettes Application Agent** : Voir dossier `mobile/screenshots/`
- **Maquettes Portail Admin** : Accessibles via le site vitrine.
- **Diagramme de Classes** : [Lien vers l'image UML](file:///C:/Users/SHERLOCK/.gemini/antigravity/brain/8ace2605-6ea0-45d7-9e43-49f90fcd395a/naissancechain_uml_official_v2_1776332539599.png)
