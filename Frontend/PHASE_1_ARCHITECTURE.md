# Architecture Phase 1 - NaissanceChain

## Lecture du cahier de charge

Le besoin central est clair : rendre visible juridiquement un enfant des sa naissance, meme dans les zones rurales ou la connectivite et les registres papier sont fragiles.

Le site vitrine de phase 1 doit donc faire trois choses :

1. Expliquer le probleme national avec des preuves chiffre es.
2. Rassurer sur la solution sans tomber dans un discours blockchain trop technique.
3. Donner une image moderne, credible et institutionnelle du projet.

## Architecture UX recommandee

### 1. Hero de conviction

- Message principal centre sur le droit a l'existence legale.
- Chiffres cles visibles immediatement.
- Double appel a l'action : comprendre la solution et voir la roadmap.

### 2. Bloc probleme / valeur

- Mise en scene du probleme central.
- Traduction du besoin en trois piliers :
  enregistrement terrain, preuve verifiable, registre resilient.

### 3. Parcours de solution

- Sequence simple en 3 etapes.
- Visualisation du flux de preuve plutot qu'une explication technique lourde.

### 4. Utilisateurs et impact

- Montrer les acteurs terrain, institutionnels et beneficiaires.
- Donner une lecture "service public" et non seulement "tech".

### 5. Pourquoi la blockchain

- Positionner la blockchain comme infrastructure de confiance.
- Mots cles a privilegier :
  permanence, verification, anti-fraude, accessibilite.

### 6. Feuille de route

- Phase 1 : site vitrine et narration.
- Phase 2 : prototype mobile + QR code + verification web.
- Phase 3 : MVP national + dashboard.

## Direction artistique

### Positionnement visuel

Une esthetique "public impact tech" : plus premium qu'un portail administratif classique, plus sobre qu'une startup flashy.

### Palette

- Bleu civique `#1B84F2` : confiance, numerique, institution.
- Jade `#17A97F` : sante, inclusion, terrain.
- Ambre `#FFB11F` : urgence humaine, mise en evidence.
- Encre `#08111F` : contrastes, titres, credibilite.
- Brume `#EDF4FF` : fonds lumineux et propres.

### Typographie

- `Space Grotesk` pour les titres.
- `Manrope` pour le contenu.

## Architecture technique React

```text
Frontend/
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
  src/
    App.jsx
    components/
      SectionTitle.jsx
      SiteShell.jsx
    index.css
    main.jsx
    data/
      siteContent.js
    pages/
      HomePage.jsx
      VerificationPage.jsx
      AboutPage.jsx
```

## Logique de composition

- `App.jsx` porte la landing page complete.
- `App.jsx` orchestre maintenant le routing et les pages du site.
- `SiteShell.jsx` mutualise header, footer et navigation.
- `SectionTitle.jsx` standardise la hierarchie editoriale des sections.
- `siteContent.js` centralise les contenus strategiques pour faciliter l'evolution.
- `index.css` pose les tokens visuels reutilisables :
  shell, panel, eyebrow, fonds et typographies.

## Prochaine etape apres la phase 1

Si on continue comme un studio produit senior, la suite logique est :

1. decouper `App.jsx` en composants de sections,
2. ajouter animations d'entree subtiles,
3. preparer une page `verification`,
4. preparer une page `a-propos` ou `partenaires`,
5. brancher les contenus finals et illustrations metier.
