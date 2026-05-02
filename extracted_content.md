# Extracted Content

## NaissanceChain_CDC.docx


🇬🇳  GUINÉE — MIABE HACKATHON 2026


NaissanceChain
Identité Numérique & Enregistrement des Naissances sur Blockchain



CAHIER DES CHARGES
Version 1.0 — Édition Hackathon 2026




Table des matières

1. Présentation du projet
1.1. Contexte
La Guinée fait face à une crise silencieuse mais structurelle : seulement 58 % des naissances sont officiellement enregistrées à l'état civil selon les données UNICEF 2022. En zones rurales et forestières, ce taux s'effondre à moins de 40 %. En conséquence, 1,8 million d'enfants guinéens n'existent pas juridiquement — ils sont invisibles aux yeux de l'État, des institutions éducatives et du système de santé.
Cette lacune administrative a des répercussions directes et profondes sur le développement humain : un enfant sans acte de naissance a 35 % moins de chances d'être scolarisé (UNICEF, 2021), ne peut pas accéder aux soins dans un établissement public et ne pourra jamais obtenir de document d'identité national ou de passeport.
Le processus d'obtention d'un acte de naissance tardif est lui-même un obstacle : il prend entre 3 et 8 mois, nécessite des déplacements souvent impossibles depuis les zones reculées, et implique une procédure administrative longue et coûteuse pour des familles déjà vulnérables.

1.2. Problématique
Comment permettre l'enregistrement fiable, rapide et vérifiable de toute naissance sur le territoire guinéen — y compris dans les zones les plus reculées — en garantissant l'intégrité, la pérennité et l'accessibilité des données face aux contraintes d'infrastructure (faible connectivité, risque de destruction des archives papier) ?

1.3. Objectifs généraux
Digitaliser l'enregistrement des naissances pour couvrir l'ensemble du territoire guinéen, y compris les zones sans accès internet stable.
Produire une preuve d'existence juridique immédiate, numérique et vérifiable pour chaque enfant enregistré.
Constituer un registre national d'état civil résilient, infalsifiable et résistant à la destruction grâce à la technologie blockchain.
Permettre une vérification instantanée des actes de naissance par les administrations, écoles et hôpitaux.

1.4. Objectifs spécifiques
Mettre à disposition des agents de terrain une application mobile fonctionnant hors connexion pour enregistrer les naissances depuis une maternité, une case de santé ou un village reculé.
Générer automatiquement un identifiant unique national et un QR code vérifiable pour chaque naissance enregistrée.
Offrir un portail web de vérification accessible aux administrations scolaires, sanitaires et judiciaires.
Fournir un tableau de bord national permettant de suivre les taux d'enregistrement par préfecture.
Sécuriser les données personnelles conformément aux principes de protection des données sensibles applicables en Guinée.

2. Parties prenantes
2.1. Cartographie des utilisateurs

2.2. Acteurs institutionnels
Ministère de la Justice et de l'Administration du Territoire de Guinée — autorité réglementaire et bénéficiaire principal.
Ministère de la Santé — partenaire pour le déploiement dans les maternités et cases de santé.
Ministère de l'Éducation Nationale — intégration de la vérification dans les processus d'inscription scolaire.
UNICEF Guinée — partenaire de données et potentiel bailleur de fonds pour la mise à l'échelle.
Darollo Technologies Corporation — organisateur du hackathon et garant du cadre de référence blockchain.

3. Description globale de la solution
3.1. Vision du système
NaissanceChain est un écosystème numérique bi-plateforme (mobile + web) permettant l'enregistrement décentralisé des naissances en Guinée. Chaque enregistrement est ancré sur une blockchain pour garantir son immuabilité, et génère un acte numérique associé à un QR code unique permettant une vérification instantanée par toute administration autorisée.
Le système est conçu pour opérer de manière totalement autonome en mode hors connexion, avec synchronisation automatique dès que la connectivité est disponible. Il ne nécessite aucune infrastructure centrale permanente pour sa disponibilité opérationnelle sur le terrain.

3.2. Description des plateformes
3.2.1. Application Mobile (Agents Terrain)
Application Android native destinée aux agents de santé, sages-femmes et agents d'état civil mobiles. Elle fonctionne intégralement hors ligne et synchronise les données lorsque la connectivité est disponible. Elle est conçue pour des appareils d'entrée de gamme avec une interface simple et adaptée à des utilisateurs peu familiers du numérique.
3.2.2. Portail Web (Administration & Vérification)
Interface web responsive accessible depuis tout navigateur moderne. Destinée aux administrateurs scolaires, personnels de santé et superviseurs ministériels. Permet la vérification des actes de naissance, la gestion des agents, et la consultation des statistiques nationales d'enregistrement.

3.3. Cas d'usage principaux

4. Fonctionnalités détaillées
4.1. Application Mobile — Agents Terrain
4.1.1. Authentification
Connexion par identifiant et mot de passe fournis par l'administration.
Authentification locale persistante (token JWT stocké localement) permettant l'utilisation hors ligne après une première connexion réussie.
Déconnexion manuelle avec effacement du cache de session.
Blocage automatique du compte après 5 tentatives infructueuses.

4.1.2. Création d'un enregistrement de naissance
Formulaire de saisie structuré en étapes (stepper) pour guider l'agent :
Étape 1 — Informations sur l'enfant : nom, prénom(s), date de naissance, heure, sexe, lieu de naissance (préfecture, sous-préfecture, village).
Étape 2 — Informations sur la mère : nom, prénom, date de naissance, nationalité, numéro d'identification (si disponible).
Étape 3 — Informations sur le père : nom, prénom, date de naissance, nationalité, numéro d'identification (si disponible). Champ optionnel.
Étape 4 — Informations sur le déclarant (agent ou personne déclarant) : nom, qualité, centre d'enregistrement.
Étape 5 — Pièces jointes : possibilité de photographier les documents disponibles (carnet de maternité, etc.).
Étape 6 — Révision et validation : récapitulatif avant soumission locale.

4.1.3. Gestion des brouillons (mode hors ligne)
Tout formulaire partiellement ou intégralement complété peut être sauvegardé en tant que brouillon local.
La liste des brouillons est accessible depuis le tableau de bord de l'application.
Chaque brouillon affiche son statut : En cours de saisie, Complet (prêt à synchroniser), Synchronisé, Certifié (Blockchain).
Suppression manuelle d'un brouillon avec confirmation obligatoire.

4.1.4. Synchronisation des données
Détection automatique de la connexion réseau (Wi-Fi ou données mobiles).
Synchronisation déclenchée automatiquement dès qu'une connexion est détectée.
Synchronisation manuelle disponible via un bouton dédié.
Indicateur visuel de progression de la synchronisation.
Gestion des conflits : en cas de doublon détecté côté serveur, l'agent est notifié pour arbitrage manuel.
Journal de synchronisation consultable depuis l'application.

4.1.5. Scan de documents / QR Code
Numérisation de pièces d'identité des parents via la caméra de l'appareil.
Scan de QR codes pour consultation d'un acte existant (vérification sur le terrain).
Pré-remplissage automatique des champs si un document numérique est scanné.

4.1.6. Consultation des dossiers
Liste paginée des enregistrements réalisés par l'agent connecté.
Filtrage par statut (brouillon, synchronisé, validé), par date et par lieu.
Fiche détaillée d'un enregistrement avec accès au QR code généré.
Partage ou impression du QR code depuis l'application (via Bluetooth ou impression Wi-Fi si disponible).

4.2. Portail Web — Administration & Dashboard
4.2.1. Gestion des utilisateurs
Création de comptes pour les agents terrain, vérificateurs et superviseurs.
Attribution et modification des rôles (ADMIN, SUPERVISEUR, VERIFICATEUR, AGENT).
Activation / désactivation de comptes sans suppression définitive.
Réinitialisation des mots de passe par l'administrateur.
Journal des connexions et des actions par utilisateur.

4.2.2. Visualisation des enregistrements
Liste complète des naissances enregistrées avec filtres multicritères (date, préfecture, sous-préfecture, statut, sexe de l'enfant).
Vue détaillée d'un enregistrement avec toutes les informations saisies et l'historique des actions.
Accès à l'acte numérique PDF et au QR code associé.

4.2.3. Contrôle & Vérification
Interface de vérification publique accessible sans authentification : saisie ou scan du QR code, affichage des informations d'état (certifié / invalide).
Interface d'administration pour l'audit, le contrôle et le suivi des enregistrements.
Possibilité d'annoter un enregistrement pour correction ou signalement de fraude.
Ancrage blockchain déclenché automatiquement dès la synchronisation réussie et validation électronique par le serveur.

4.2.4. Statistiques et reporting
Tableau de bord national : nombre total d'enregistrements, répartition par sexe, par région, par préfecture.
Carte interactive de couverture affichant les taux d'enregistrement par préfecture (code couleur : rouge < 40%, orange 40-70%, vert > 70%).
Évolution temporelle du nombre d'enregistrements (graphique mensuel).
Export des données en format CSV pour traitement externe.

4.2.5. Recherche et filtrage
Recherche par nom de l'enfant, numéro d'acte, identifiant QR ou identifiant blockchain.
Filtres combinables : période, préfecture, sous-préfecture, agent, statut.
Pagination avec sélection du nombre de résultats par page.

5. Contraintes techniques
5.1. Mode hors ligne obligatoire
L'application mobile doit être intégralement fonctionnelle sans aucune connexion internet. Toutes les opérations de saisie, de consultation et de gestion des brouillons doivent être disponibles en mode offline. La connexion n'est requise qu'au moment de la synchronisation.

5.2. Synchronisation automatique
La synchronisation doit être transparente pour l'utilisateur : déclenchement automatique, gestion des conflits, retentative en cas d'échec partiel, et notification du résultat. Les données doivent être transmises de manière atomique (tout ou rien par enregistrement) pour éviter les états incohérents.

5.3. Sécurité des données
Chiffrement de la base de données locale sur l'appareil mobile (SQLCipher ou équivalent).
Transmission des données chiffrée via HTTPS/TLS 1.3.
Authentification par JWT avec durée de validité limitée.
Données personnelles non stockées en clair sur les serveurs de transit.
Accès aux données personnelles strictement limité aux rôles autorisés.

5.4. Performance en faible connectivité
L'API doit être optimisée pour les faibles débits (payloads JSON compressés).
Téléchargement progressif des images et pièces jointes en arrière-plan.
Timeout et retries configurables pour les appels réseau.
Taille maximale d'un enregistrement synchronisé : 5 Mo (images incluses).

5.5. Compatibilité
Android 8.0 (API level 26) minimum — priorité absolue.
Compatibilité avec des appareils d'entrée de gamme (2 Go de RAM minimum, écrans 5 pouces).
Interface web : Chrome, Firefox, Edge — versions N-2 au minimum.
Responsive design pour les tablettes (utilisées par certains agents terrain).

6. Architecture technique proposée
6.1. Vue d'ensemble

6.2. Composante Blockchain
Chaque naissance certifiée génère une transaction blockchain contenant : le hash de l'acte de naissance (et non les données personnelles brutes), l'identifiant unique national (IUN) de l'enfant, l'horodatage de certification, et l'identifiant de l'agent créateur. Cette approche garantit l'immuabilité et la vérifiabilité sans exposer les données personnelles sur la chaîne publique.

6.3. Gestion du mode hors ligne
Base de données SQLite locale sur l'appareil Android pour le stockage des brouillons et des données synchronisées.
File d'attente de synchronisation (Sync Queue) persistante : les enregistrements en attente sont stockés et rejoués dès que la connexion est rétablie.
Mécanisme de versionning des données pour résoudre les conflits lors de la synchronisation.

7. Modélisation des données (conceptuelle)
7.1. Entités principales

7.2. Relations entre entités
Naissance (1) — (1) Enfant : chaque naissance concerne un unique enfant.
Naissance (1) — (0..2) Parent : une naissance est liée à la mère (obligatoire) et au père (optionnel).
Naissance (1) — (1) ActeNumerique : un acte est généré lors de la synchronisation d'une naissance.
Naissance (1) — (1) TransactionBlockchain : une transaction est créée par ancrage de l'acte.
Agent (1) — (N) Naissance : un agent peut créer plusieurs enregistrements.
Centre (1) — (N) Agent : un centre regroupe plusieurs agents.
Prefecture (1) — (N) Centre : une préfecture contient plusieurs centres.

8. Workflow du système
8.1. Processus complet : de la collecte à la certification immédiate
L'agent terrain se connecte à l'application mobile (authentification locale si hors ligne).
L'agent remplit le formulaire d'enregistrement en mode offline (données stockées localement en brouillon).
Le brouillon passe au statut 'Complet' une fois toutes les informations obligatoires saisies.
Dès que la connectivité est disponible, la synchronisation automatique envoie l'enregistrement au serveur backend.
Le backend effectue une validation automatique de format et d'intégrité des données reçues.
L'enregistrement est immédiatement certifié. Le backend génère automatiquement : l'Identifiant Unique National (IUN), l'acte numérique en PDF, le QR code de vérification, et déclenche l'ancrage blockchain (hash de l'acte).
Un superviseur ou administrateur peut examiner les enregistrements a posteriori via le portail web pour audit et contrôle qualité.
En cas d'erreur détectée, une procédure de correction peut être initiée, avec mise à jour du hash sur la blockchain si nécessaire (historique conservé).
L'acte certifié est accessible via le portail de vérification public — scan du QR code ou saisie de l'IUN.

8.2. États des données

9. Sécurité et gestion des accès
9.1. Authentification
Authentification par identifiant (email ou matricule) et mot de passe hashé (bcrypt, factor 12 minimum).
Émission d'un token JWT signé à la connexion, valide 8 heures. Refresh token valide 30 jours pour maintenir la session sur mobile.
En mode hors ligne : le token est validé localement. L'expiration du token force une reconnexion à la prochaine disponibilité réseau.
Blocage automatique du compte après 5 tentatives d'authentification infructueuses consécutives.

9.2. Matrice des autorisations (RBAC)

9.3. Protection des données sensibles
Chiffrement AES-256 de la base de données SQLite locale sur les appareils mobiles.
Les données personnelles (noms, dates de naissance, informations parentales) ne sont jamais stockées en clair dans les logs ou les fichiers temporaires.
Sur la blockchain, seul le hash SHA-256 de l'acte est ancré — aucune donnée personnelle n'est exposée sur la chaîne.
Conformité aux principes de minimisation des données : seules les informations strictement nécessaires sont collectées.
Politique de rétention des données définie par le Ministère de tutelle.

10. Livrables attendus

11. Plan de développement (adapté Hackathon)
11.1. Priorisation : MVP vs Fonctionnalités avancées

11.2. Planning par phase (3 phases Hackathon)

12. Critères de réussite
12.1. Fonctionnalité

12.2. Performance
Démarrage de l'application mobile en moins de 3 secondes sur un appareil d'entrée de gamme.
Chargement du tableau de bord web en moins de 4 secondes sur une connexion 3G.
Synchronisation d'un lot de 20 enregistrements en moins de 2 minutes sur une connexion 3G.
Aucune perte de données en cas d'interruption de synchronisation en cours.

12.3. Expérience utilisateur
Interface mobile utilisable par un agent n'ayant jamais utilisé l'application après 15 minutes de formation.
Feedback visuel clair sur le statut (Brouillon, Synchronisé, Certifié) de chaque enregistrement à tout moment.
Messages d'erreur compréhensibles en français guinéen, sans jargon technique.
Navigation intuitive : maximum 3 clics pour accéder à n'importe quelle fonctionnalité principale.

12.4. Robustesse
Aucune perte de données en cas de coupure de courant pendant la saisie (sauvegarde automatique toutes les 30 secondes).
Gestion correcte des tentatives de double synchronisation d'un même enregistrement (idempotence).
L'application ne crashe pas en cas de base de données locale pleine ou d'espace disque insuffisant (message d'alerte).
Le portail web reste accessible même si le nœud blockchain est temporairement indisponible.


NaissanceChain — Chaque naissance enregistrée est un enfant qui existe.
MIABE Hackathon 2026 — Darollo Technologies Corporation — GN-01

---

## PROJET_N°1_GUINEE.pdf

MIABE HACKATHON 2026 | Cadre de Référence | DAROLLO TECHNOLOGIES CORPORATION 
DTC — Darollo Technologies Corporation | www.miabehackathon.com | La Blockchain, levier du développement durable africain — Page 118 
🇬🇳 GUINÉE 
D06 — Identité numérique & Registres civils 
PROJET GN-01 
NaissanceChain 
MBH 
2026 
Edition 
ODD 3 — Bonne santé   ·   ODD 4 — Éducation de qualité   ·   ODD 10 — Inégalités réduites   ·   ODD 16 — Institutions efficaces 
 
CONTEXTE ET ENJEUX 
En Guinée, seulement 58 % des 
naissances font l'objet d'un enregistrement 
officiel. En zones rurales, ce taux tombe à 
moins de 40 %. Résultat : 1,8 million 
d'enfants guinéens n'existent pas 
juridiquement. Sans acte de naissance, un 
enfant ne peut pas être scolarisé, accéder 
aux soins dans un établissement public, ni 
obtenir un passeport. 
DONNEES CLES 
▸ 58 % seulement des naissances en Guinée sont 
enregistrées à l'état civil (UNICEF Guinée, 2022). 
▸ En zones rurales et forestières, le taux d'enregistrement 
des naissances est inférieur à 40 %. 
▸ 1,8 million d'enfants guinéens n'ont pas d'acte de 
naissance officiel. 
▸ Un enfant sans acte de naissance a 35 % moins de 
chances d'être scolarisé (UNICEF, 2021). 
▸ Obtenir un acte de naissance tardif en Guinée prend 3 à 8 
mois et exige un déplacement souvent impossible. 
 
 PROBLÈME CENTRAL 
Des millions d'enfants guinéens n'existent pas sur le papier, et donc pas pour l'État. Ils sont 
invisibles au système de santé, à l'école et aux protections sociales. La solution doit permettre 
d'enregistrer une naissance depuis n'importe quel point du ter ritoire guinéen — maternité 
rurale, case de santé, village reculé — et de générer immédiatement une preuve d'existence 
juridique vérifiable. 
 
 
CE QUE LA SOLUTION DOIT ACCOMPLIR 
▸ Permettre à des agents mobiles 
d'enregistrer une naissance depuis un 
téléphone ou une tablette. 
▸ Générer un identifiant unique et une 
preuve numérique vérifiable pour 
l'enfant enregistré. 
▸ Permettre aux écoles, hôpitaux et 
administrations de vérifier 
instantanément un acte de naissance. 
▸ Constituer un registre national 
résistant à la perte ou à la destruction 
des archives papier. 
UTILISATEURS FINAUX 
▸ Agents de santé et sages-femmes dans les maternités et cases 
de santé 
▸ Agents d'état civil mobiles dans les préfectures rurales 
▸ Familles souhaitant enregistrer la naissance d'un enfant 
▸ Écoles et hôpitaux vérifiant les actes de naissance 
▸ Ministère de la Justice et de l'Administration du Territoire de 
Guinée 
IMPACT ATTENDU 
Chaque naissance enregistrée est un enfant qui peut aller à l'école, 
accéder aux soins et être compté dans les politiques publiques. 
L'enregistrement des 1,8 million d'enfants non enregistrés 
représente un potentiel humain considérable pour la Guinée. 
 
⬡ POURQUOI LA BLOCKCHAIN ?  Un acte de naissance blockchain est indestructible — les registres papier 
brûlent, les archives s'inondent. Une naissance enregistrée sur blockchain existe pour toujours, accessible 
depuis n'importe quel appareil connecté. L'immuabilité empêche aussi les f alsifications et modifications 
rétroactives. 
 
MIABE HACKATHON 2026 | Cadre de Référence | DAROLLO TECHNOLOGIES CORPORATION 
DTC — Darollo Technologies Corporation | www.miabehackathon.com | La Blockchain, levier du développement durable africain — Page 119 
PHASE 1 — Présélection 
▸ Documenter le problème de 
l'enregistrement des naissances en 
Guinée avec données par région et 
conséquences 
▸ Concevoir les maquettes visuelles : 
application agent terrain, portail de 
vérification administratif, écran famille 
▸ Créer un site vitrine présentant 
NaissanceChain et l'impact pour les 1,8 
million d'enfants non enregistrés 
▸ Décrire la composante blockchain : 
comment l'acte est enregistré, comment 
la vérification fonctionne, comment le 
mode hors-ligne est géré 
PHASE 2 — Demi-finale 
▸ Application mobile agent 
terrain avec formulaire 
d'enregistrement et mode hors 
connexion 
▸ Génération d'un acte 
numérique avec QR code de 
vérification unique 
▸ Portail web de vérification 
pour les administrations 
scolaires et sanitaires 
▸ Démo live : naissance 
enregistrée → QR code généré 
→ QR scanné par une école 
PHASE 3 — Finale 
▸ MVP complet avec agent 
mobile et vérification web 
intégrés 
▸ Tableau de bord national : 
taux d'enregistrement par 
préfecture avec carte de 
couverture 
▸ Documentation et pitch 10 
min : impact pour les 1,8 
million d'enfants guinéens 
non enregistrés 
  
