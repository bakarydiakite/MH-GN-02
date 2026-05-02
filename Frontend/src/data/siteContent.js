export const metrics = [
  { value: "45%", label: "des naissances non enregistrees" },
  { value: "2M+", label: "enfants sans identite legale" },
  { value: "0", label: "acces garanti aux services publics sans preuve d'existence" },
];

export const pillars = [
  {
    title: "Enregistrement terrain immediat",
    description:
      "Permettre aux agents de saisir une naissance depuis une maternite, un centre de sante ou un village recule, meme avec une connectivite limitee.",
  },
  {
    title: "Preuve numerique verifiable",
    description:
      "Generer un identifiant unique et un justificatif numerique consultable par les familles, ecoles, hopitaux et administrations.",
  },
  {
    title: "Registre national resilient",
    description:
      "Securiser l'historique des naissances dans un systeme resistant a la perte, a la fraude documentaire et a la destruction des archives papier.",
  },
];

export const problemStats = [
  {
    value: "45%",
    title: "des naissances non enregistrees",
    text: "Pres de la moitie des enfants nes en Guinee ne recoivent pas de preuve officielle a temps.",
    tone: "text-[#ea7b59]",
  },
  {
    value: "2M+",
    title: "enfants sans acces a l'ecole",
    text: "Sans acte de naissance, l'inscription scolaire reste impossible ou tres fragile.",
    tone: "text-[#e0b94d]",
  },
  {
    value: "60%",
    title: "exclus des soins de sante",
    text: "L'absence d'identite legale prive des milliers d'enfants de services essentiels.",
    tone: "text-[#ea7b59]",
  },
];

export const problemConsequences = [
  {
    title: "Pas d'acces a l'education",
    text: "L'inscription scolaire exige un acte de naissance. Sans lui, des milliers d'enfants restent en dehors du systeme educatif.",
  },
  {
    title: "Pas d'acces aux soins",
    text: "Les programmes de vaccination et les services de sante publique necessitent une identite enregistree.",
  },
  {
    title: "Pas d'identite legale",
    text: "Sans acte de naissance, l'enfant n'existe pas aux yeux de l'Etat. Il ne peut ni voter, ni travailler legalement plus tard.",
  },
  {
    title: "Gouvernance aveugle",
    text: "L'Etat ne peut planifier ni allouer des ressources sans donnees fiables sur sa population reelle.",
  },
];

export const solutionChecklist = [
  "Fonctionne sans connexion internet",
  "Deployable sur smartphones Android basiques",
  "Conforme aux standards internationaux d'identite",
  "Donnees protegees par chiffrement de bout en bout",
];

export const solutionCards = [
  {
    title: "Enregistrement mobile",
    text: "Les agents de terrain enregistrent les naissances directement depuis leur telephone, meme sans connexion internet.",
    badge: "Offline-first",
    tone: "accent",
  },
  {
    title: "Identite numerique",
    text: "Chaque enfant recoit un identifiant unique national, lie a ses donnees biographiques securisees.",
    badge: "ID unique",
    tone: "brand",
  },
  {
    title: "Verification instantanee",
    text: "Un QR code permet a tout agent autorise de verifier l'identite d'un enfant en quelques secondes.",
    badge: "Temps reel",
    tone: "accent",
  },
  {
    title: "Registre securise",
    text: "Toutes les donnees sont stockees dans un registre numerique chiffre, accessible aux autorites competentes.",
    badge: "Chiffre",
    tone: "brand",
  },
];

export const roadmap = [
  {
    phase: "Phase 1",
    title: "Site vitrine et vision produit",
    items: [
      "Formaliser le probleme, l'impact national et les utilisateurs cibles",
      "Presenter le parcours d'enregistrement et la logique blockchain en langage simple",
      "Installer une identite digitale forte pour le projet NaissanceChain",
    ],
  },
  {
    phase: "Phase 2",
    title: "Prototype agent mobile",
    items: [
      "Formulaire d'enregistrement hors connexion",
      "Generation d'un acte numerique avec QR code unique",
      "Portail web minimal de verification",
    ],
  },
  {
    phase: "Phase 3",
    title: "MVP national et dashboard",
    items: [
      "Verification web integree pour les institutions",
      "Tableau de bord de couverture par prefecture",
      "Documentation d'impact et pilotage du deploiement",
    ],
  },
];

export const proofSteps = [
  {
    id: "01",
    title: "L'agent enregistre la naissance",
    text: "Un agent de sante ou d'etat civil saisit les informations de l'enfant via l'application mobile, meme sans connexion.",
    tags: ["Formulaire guide", "Mode hors ligne", "Validation automatique"],
  },
  {
    id: "02",
    title: "Donnees securisees et synchronisees",
    text: "Les donnees sont chiffrees localement puis synchronisees avec le registre national des qu'une connexion est disponible.",
    tags: ["Chiffrement AES-256", "Synchronisation automatique", "Audit trail"],
  },
  {
    id: "03",
    title: "Identifiant unique genere",
    text: "Le systeme genere automatiquement un identifiant national unique pour l'enfant, lie a un certificat numerique officiel.",
    tags: ["ID national", "Certificat PDF", "Archivage permanent"],
  },
  {
    id: "04",
    title: "Verification via QR code",
    text: "Les ecoles, hopitaux et administrations peuvent scanner ce code pour verifier instantanement l'identite de l'enfant.",
    tags: ["Scan instantane", "Acces controle", "Verification hors ligne"],
  },
];

export const palette = [
  {
    role: "Primaire",
    hex: "#1B84F2",
    description: "Confiance, innovation publique, lisibilite digitale.",
    className: "bg-brand-500 text-white",
    labelClass: "text-brand-50/80",
    textClass: "text-brand-50/90",
  },
  {
    role: "Secondaire",
    hex: "#17A97F",
    description: "Sante, fiabilite terrain, progression positive.",
    className: "bg-accent-500 text-white",
    labelClass: "text-accent-50/80",
    textClass: "text-accent-50/90",
  },
  {
    role: "Accent",
    hex: "#FFB11F",
    description: "Signal d'urgence, points d'impact, appels visuels.",
    className: "bg-sun-400 text-ink",
    labelClass: "text-ink/70",
    textClass: "text-ink/80",
  },
];

export const verificationFlow = [
  {
    id: "01",
    title: "Scanner ou saisir l'identifiant",
    text: "L'agent ou l'institution entre le code unique ou scanne le QR code recu avec l'acte numerique.",
  },
  {
    id: "02",
    title: "Comparer la preuve et les metadonnees",
    text: "Le portail reconstitue les informations essentielles : origine, date d'enregistrement, integrite de la preuve.",
  },
  {
    id: "03",
    title: "Rendre un verdict lisible",
    text: "L'interface affiche un statut simple, des details de verification et le niveau de confiance associe.",
  },
];

export const verificationChecks = [
  {
    title: "Statut de validite",
    text: "Afficher un badge clair : valide, en attente, invalide ou non trouve.",
  },
  {
    title: "Structure emettrice",
    text: "Identifier le centre de sante, la prefecture ou l'administration a l'origine de la saisie.",
  },
  {
    title: "Horodatage fiable",
    text: "Rendre visible la date de creation et, si utile, la date de synchronisation du dossier.",
  },
  {
    title: "Empreinte unique",
    text: "Montrer la reference technique de l'acte sans imposer un jargon complexe a l'utilisateur.",
  },
];

export const principles = [
  {
    title: "Humaniser la technologie",
    text: "Le projet doit toujours partir du droit de l'enfant et non d'un discours purement technique.",
  },
  {
    title: "Concevoir pour le terrain",
    text: "Les usages ruraux, les coupures de reseau et les contraintes administratives doivent guider le design.",
  },
  {
    title: "Rassurer les institutions",
    text: "Le site doit installer une confiance visuelle et narrative a destination des acteurs publics et des partenaires.",
  },
];

export const contactChannels = [
  {
    label: "Email",
    value: "contact@naissancechain.gn",
  },
  {
    label: "Localisation",
    value: "Conakry, Republique de Guinee",
  },
  {
    label: "Telephone",
    value: "+224 620 000 000",
  },
];

export const partners = [
  {
    name: "Ministere de la Sante",
    role: "Point d'ancrage pour les maternites, sages-femmes et centres de sante qui initient l'enregistrement.",
  },
  {
    name: "Etat civil et administration territoriale",
    role: "Cadre de validation juridique, de verification et de pilotage du registre national.",
  },
  {
    name: "Education et hopitaux",
    role: "Structures qui doivent verifier rapidement la legitimite d'un acte numerique.",
  },
  {
    name: "Partenaires techniques et sociaux",
    role: "Appui au deploiement, a la sensibilisation et a la mesure d'impact dans les territoires.",
  },
];

export const teamMoments = [
  {
    when: "Minute 1",
    title: "Le probleme humain",
    text: "Des enfants restent invisibles juridiquement et sont prives de services essentiels.",
  },
  {
    when: "Minute 2",
    title: "La reponse produit",
    text: "Un agent peut enregistrer une naissance sur le terrain et produire une preuve numerique verifiable.",
  },
  {
    when: "Minute 3",
    title: "La vision nationale",
    text: "Le systeme devient une infrastructure de confiance pour les administrations, les familles et les institutions.",
  },
];

export const footerNav = [
  { label: "Probleme", href: "/#probleme" },
  { label: "Solution", href: "/#solution" },
  { label: "Comment ca marche", href: "/#process" },
  { label: "Impact", href: "/#impact" },
  { label: "Contact", href: "/#contact" },
];
