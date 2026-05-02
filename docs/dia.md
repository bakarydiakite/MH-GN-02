
classDiagram
    direction LR
    class UTILISATEUR {
        +id: UUID
        +nom: String
        +email: String
        +role: Role
        +seConnecter()
        +seDeconnecter()
    }
    class AGENT {
        +matricule: String
        +zoneAffectation: String
        +creerEnregistrement()
        +synchroniser()
    }
    class CENTRE {
        +nom: String
        +type: Type
        +localisation: String
        +affecterAgent()
    }
    class NAISSANCE {
        +numeroCertificat: String
        +statut: Statut
        +dateDresse: Date
        +valider()
    }
    class ENFANT {
        +nom: String
        +prenoms: String
        +dateNaissance: Date
        +calculerAge()
    }
    class PARENT {
        +type: Type
        +nom: String
        +prenom: String
        +cni: String
    }
    class DECLARANT {
        +nom: String
        +numeroIdentification: String
        +signer()
    }
    class ACTE_NUMERIQUE {
        +numeroActe: String
        +urlPdf: String
        +qrCode: String
        +genererPDF()
    }
    class TRANSACTION_BLOCKCHAIN {
        +txHash: String
        +reseau: String
        +ancrerHash()
    }
    class JOURNAL_SYNCHRONISATION {
        +dateTentative: DateTime
        +statut: Statut
    }
    class JOURNAL_AUDIT {
        +action: String
        +timestamp: DateTime
    }
    class VERIFICATION {
        +dateVerif: DateTime
        +resultat: String
    }

    UTILISATEUR "1" -- "0..1" AGENT : authentifie
    AGENT "1" -- "*" NAISSANCE : enregistre
    NAISSANCE "1" -- "1" ENFANT : concerne
    NAISSANCE "1" -- "1..2" PARENT : lie a
    NAISSANCE "1" -- "0..1" DECLARANT : declaree par
    NAISSANCE "1" -- "1" ACTE_NUMERIQUE : produit
    NAISSANCE "1" -- "1" TRANSACTION_BLOCKCHAIN : ancree par
    AGENT "*" -- "1" CENTRE : affecte a
    NAISSANCE "*" -- "*" VERIFICATION : fait l'objet de
    UTILISATEUR "1" -- "*" JOURNAL_AUDIT : consigne
    NAISSANCE "1" -- "*" JOURNAL_SYNCHRONISATION : journalise
