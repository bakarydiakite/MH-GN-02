-- =========================================================
-- NaissanceChain - Schéma SQL PostgreSQL complet
-- =========================================================

BEGIN;

-- =========================================================
-- 1. EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 2. TYPES ENUM
-- =========================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_utilisateur') THEN
        CREATE TYPE role_utilisateur AS ENUM (
            'ADMINISTRATEUR',
            'SUPERVISEUR',
            'VERIFICATEUR',
            'AGENT'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_naissance') THEN
        CREATE TYPE statut_naissance AS ENUM (
            'BROUILLON',
            'COMPLET',
            'SYNCHRONISE',
            'EN_ATTENTE',
            'VALIDE',
            'REJETE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_parent') THEN
        CREATE TYPE type_parent AS ENUM (
            'PERE',
            'MERE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_centre') THEN
        CREATE TYPE type_centre AS ENUM (
            'MATERNITE',
            'CASE_SANTE',
            'PREFECTURE',
            'HOPITAL',
            'AUTRE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_synchronisation') THEN
        CREATE TYPE statut_synchronisation AS ENUM (
            'EN_ATTENTE',
            'SUCCES',
            'ECHEC'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_verification') THEN
        CREATE TYPE statut_verification AS ENUM (
            'VALIDE',
            'INVALIDE',
            'EN_ATTENTE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moyen_verification') THEN
        CREATE TYPE moyen_verification AS ENUM (
            'NUMERO_ACTE',
            'QR_CODE'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_transaction_blockchain') THEN
        CREATE TYPE statut_transaction_blockchain AS ENUM (
            'EN_ATTENTE',
            'CONFIRMEE',
            'ECHEC'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_piece_jointe') THEN
        CREATE TYPE type_piece_jointe AS ENUM (
            'PHOTO_CNI',
            'PHOTO_CARNET',
            'PHOTO_AUTRE',
            'PDF_AUTRE'
        );
    END IF;
END$$;

-- =========================================================
-- 3. TABLES DE REFERENCE ADMINISTRATIVE
-- =========================================================

CREATE TABLE IF NOT EXISTS prefectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL UNIQUE,
    region VARCHAR(150),
    code VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL,
    prefecture_id UUID NOT NULL REFERENCES prefectures(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (nom, prefecture_id)
);

CREATE TABLE IF NOT EXISTS sous_prefectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL,
    prefecture_id UUID NOT NULL REFERENCES prefectures(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (nom, prefecture_id)
);

CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL,
    sous_prefecture_id UUID REFERENCES sous_prefectures(id) ON DELETE SET NULL,
    commune_id UUID REFERENCES communes(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 4. UTILISATEURS ET STRUCTURES
-- =========================================================

CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(120) NOT NULL,
    prenom VARCHAR(120),
    email VARCHAR(180) UNIQUE,
    telephone VARCHAR(30),
    mot_de_passe_hash TEXT NOT NULL,
    role role_utilisateur NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    derniere_connexion_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(180) NOT NULL,
    type type_centre NOT NULL,
    prefecture_id UUID REFERENCES prefectures(id) ON DELETE SET NULL,
    commune_id UUID REFERENCES communes(id) ON DELETE SET NULL,
    sous_prefecture_id UUID REFERENCES sous_prefectures(id) ON DELETE SET NULL,
    village_id UUID REFERENCES villages(id) ON DELETE SET NULL,
    adresse TEXT,
    coordonnees_gps VARCHAR(120),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID NOT NULL UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
    matricule VARCHAR(80) UNIQUE,
    centre_id UUID REFERENCES centres(id) ON DELETE SET NULL,
    fonction VARCHAR(120),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 5. TABLE CENTRALE : NAISSANCES
-- =========================================================

CREATE TABLE IF NOT EXISTS naissances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    numero_certificat VARCHAR(100) UNIQUE,
    numero_identification_national VARCHAR(100) UNIQUE,
    identifiant_unique_national VARCHAR(100) UNIQUE,

    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    centre_id UUID REFERENCES centres(id) ON DELETE SET NULL,

    prefecture_administrative_id UUID REFERENCES prefectures(id) ON DELETE SET NULL,
    commune_id UUID REFERENCES communes(id) ON DELETE SET NULL,

    statut statut_naissance NOT NULL DEFAULT 'BROUILLON',

    date_dresse DATE,
    officier_etat_civil_nom VARCHAR(180),
    approuve_par VARCHAR(180),
    commentaire_rejet TEXT,

    hash_blockchain TEXT,
    qr_reference TEXT,

    date_creation_metier TIMESTAMP NOT NULL DEFAULT NOW(),
    date_validation TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 6. ENFANT
-- =========================================================

CREATE TABLE IF NOT EXISTS enfants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL UNIQUE REFERENCES naissances(id) ON DELETE CASCADE,

    prenoms VARCHAR(180) NOT NULL,
    nom VARCHAR(120) NOT NULL,

    region_naissance VARCHAR(150),
    prefecture_naissance_id UUID REFERENCES prefectures(id) ON DELETE SET NULL,
    sous_prefecture_naissance_id UUID REFERENCES sous_prefectures(id) ON DELETE SET NULL,
    commune_naissance_id UUID REFERENCES communes(id) ON DELETE SET NULL,
    village_naissance_id UUID REFERENCES villages(id) ON DELETE SET NULL,
    lieu_naissance_libelle VARCHAR(255),

    date_naissance DATE NOT NULL,
    heure_naissance TIME,
    sexe VARCHAR(20) NOT NULL CHECK (sexe IN ('MASCULIN', 'FEMININ')),
    nationalite VARCHAR(100) DEFAULT 'Guinéenne',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 7. PARENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL REFERENCES naissances(id) ON DELETE CASCADE,

    type type_parent NOT NULL,

    nom VARCHAR(120) NOT NULL,
    prenom VARCHAR(120),
    date_naissance DATE,
    numero_identification VARCHAR(120),
    cni_ou_autre VARCHAR(120),
    nationalite VARCHAR(100),
    profession VARCHAR(120),

    region_adresse VARCHAR(150),
    prefecture_adresse_id UUID REFERENCES prefectures(id) ON DELETE SET NULL,
    sous_prefecture_adresse_id UUID REFERENCES sous_prefectures(id) ON DELETE SET NULL,
    commune_adresse_id UUID REFERENCES communes(id) ON DELETE SET NULL,
    quartier_district VARCHAR(150),
    secteur_village VARCHAR(150),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE (naissance_id, type)
);

-- =========================================================
-- 8. DECLARANT
-- =========================================================

CREATE TABLE IF NOT EXISTS declarants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL UNIQUE REFERENCES naissances(id) ON DELETE CASCADE,

    nom VARCHAR(180) NOT NULL,
    numero_identification VARCHAR(120),
    lien_parente VARCHAR(120),
    cni_ou_autre VARCHAR(120),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 9. PIECES JOINTES
-- =========================================================

CREATE TABLE IF NOT EXISTS pieces_jointes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL REFERENCES naissances(id) ON DELETE CASCADE,

    type type_piece_jointe NOT NULL,
    nom_fichier VARCHAR(255),
    url_fichier TEXT NOT NULL,
    mime_type VARCHAR(120),
    taille_octets BIGINT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 10. ACTE NUMERIQUE
-- =========================================================

CREATE TABLE IF NOT EXISTS actes_numeriques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL UNIQUE REFERENCES naissances(id) ON DELETE CASCADE,

    numero_acte VARCHAR(100) UNIQUE,
    url_pdf TEXT,
    qr_code_data TEXT,
    qr_code_image_url TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    date_generation TIMESTAMP NOT NULL DEFAULT NOW(),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 11. TRANSACTION BLOCKCHAIN
-- =========================================================

CREATE TABLE IF NOT EXISTS transactions_blockchain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL UNIQUE REFERENCES naissances(id) ON DELETE CASCADE,

    tx_hash VARCHAR(255) UNIQUE,
    reseau_blockchain VARCHAR(120),
    bloc_numero BIGINT,
    horodatage_ancrage TIMESTAMP,
    statut statut_transaction_blockchain NOT NULL DEFAULT 'EN_ATTENTE',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 12. JOURNAL DE SYNCHRONISATION
-- =========================================================

CREATE TABLE IF NOT EXISTS journaux_synchronisation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID NOT NULL REFERENCES naissances(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,

    statut statut_synchronisation NOT NULL,
    tentatives INTEGER NOT NULL DEFAULT 0,
    message_erreur TEXT,
    date_dernier_essai TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 13. VERIFICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naissance_id UUID REFERENCES naissances(id) ON DELETE SET NULL,

    moyen moyen_verification NOT NULL,
    valeur_recherchee VARCHAR(255),
    resultat statut_verification NOT NULL,

    verifie_par_utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    organisme VARCHAR(180),
    adresse_ip VARCHAR(64),

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 14. JOURNAL D'AUDIT
-- =========================================================

CREATE TABLE IF NOT EXISTS journaux_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,

    action VARCHAR(180) NOT NULL,
    type_entite VARCHAR(120) NOT NULL,
    entite_id UUID,
    details JSONB,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 15. INDEX
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_utilisateurs_role
    ON utilisateurs(role);

CREATE INDEX IF NOT EXISTS idx_agents_centre
    ON agents(centre_id);

CREATE INDEX IF NOT EXISTS idx_naissances_statut
    ON naissances(statut);

CREATE INDEX IF NOT EXISTS idx_naissances_agent
    ON naissances(agent_id);

CREATE INDEX IF NOT EXISTS idx_naissances_centre
    ON naissances(centre_id);

CREATE INDEX IF NOT EXISTS idx_naissances_date_creation_metier
    ON naissances(date_creation_metier);

CREATE INDEX IF NOT EXISTS idx_enfants_nom
    ON enfants(nom);

CREATE INDEX IF NOT EXISTS idx_enfants_prenoms
    ON enfants(prenoms);

CREATE INDEX IF NOT EXISTS idx_parents_type
    ON parents(type);

CREATE INDEX IF NOT EXISTS idx_pieces_jointes_naissance
    ON pieces_jointes(naissance_id);

CREATE INDEX IF NOT EXISTS idx_journaux_sync_naissance
    ON journaux_synchronisation(naissance_id);

CREATE INDEX IF NOT EXISTS idx_journaux_sync_statut
    ON journaux_synchronisation(statut);

CREATE INDEX IF NOT EXISTS idx_verifications_naissance
    ON verifications(naissance_id);

CREATE INDEX IF NOT EXISTS idx_verifications_resultat
    ON verifications(resultat);

CREATE INDEX IF NOT EXISTS idx_audit_utilisateur
    ON journaux_audit(utilisateur_id);

-- =========================================================
-- 16. TRIGGERS updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION maj_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_utilisateurs_updated_at'
    ) THEN
        CREATE TRIGGER trg_utilisateurs_updated_at
        BEFORE UPDATE ON utilisateurs
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_prefectures_updated_at'
    ) THEN
        CREATE TRIGGER trg_prefectures_updated_at
        BEFORE UPDATE ON prefectures
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_communes_updated_at'
    ) THEN
        CREATE TRIGGER trg_communes_updated_at
        BEFORE UPDATE ON communes
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sous_prefectures_updated_at'
    ) THEN
        CREATE TRIGGER trg_sous_prefectures_updated_at
        BEFORE UPDATE ON sous_prefectures
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_villages_updated_at'
    ) THEN
        CREATE TRIGGER trg_villages_updated_at
        BEFORE UPDATE ON villages
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_centres_updated_at'
    ) THEN
        CREATE TRIGGER trg_centres_updated_at
        BEFORE UPDATE ON centres
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_agents_updated_at'
    ) THEN
        CREATE TRIGGER trg_agents_updated_at
        BEFORE UPDATE ON agents
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_naissances_updated_at'
    ) THEN
        CREATE TRIGGER trg_naissances_updated_at
        BEFORE UPDATE ON naissances
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enfants_updated_at'
    ) THEN
        CREATE TRIGGER trg_enfants_updated_at
        BEFORE UPDATE ON enfants
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_parents_updated_at'
    ) THEN
        CREATE TRIGGER trg_parents_updated_at
        BEFORE UPDATE ON parents
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_declarants_updated_at'
    ) THEN
        CREATE TRIGGER trg_declarants_updated_at
        BEFORE UPDATE ON declarants
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_actes_numeriques_updated_at'
    ) THEN
        CREATE TRIGGER trg_actes_numeriques_updated_at
        BEFORE UPDATE ON actes_numeriques
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_transactions_blockchain_updated_at'
    ) THEN
        CREATE TRIGGER trg_transactions_blockchain_updated_at
        BEFORE UPDATE ON transactions_blockchain
        FOR EACH ROW EXECUTE FUNCTION maj_updated_at();
    END IF;
END$$;

-- =========================================================
-- 17. CONTRAINTES METIER COMPLEMENTAIRES
-- =========================================================

-- Vérifie qu'un agent pointe vers un utilisateur de rôle AGENT
CREATE OR REPLACE FUNCTION verifier_role_agent()
RETURNS TRIGGER AS $$
DECLARE
    v_role role_utilisateur;
BEGIN
    SELECT role INTO v_role
    FROM utilisateurs
    WHERE id = NEW.utilisateur_id;

    IF v_role IS DISTINCT FROM 'AGENT' THEN
        RAISE EXCEPTION 'L''utilisateur lié à la table agents doit avoir le rôle AGENT';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_verifier_role_agent'
    ) THEN
        CREATE TRIGGER trg_verifier_role_agent
        BEFORE INSERT OR UPDATE ON agents
        FOR EACH ROW EXECUTE FUNCTION verifier_role_agent();
    END IF;
END$$;

COMMIT;