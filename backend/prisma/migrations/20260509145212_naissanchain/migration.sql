-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR', 'AGENT', 'FAMILLE');

-- CreateEnum
CREATE TYPE "BirthStatus" AS ENUM ('BROUILLON', 'COMPLET', 'SYNCHRONISE', 'EN_ATTENTE', 'VALIDE', 'REJETE');

-- CreateEnum
CREATE TYPE "ParentType" AS ENUM ('PERE', 'MERE');

-- CreateEnum
CREATE TYPE "CenterType" AS ENUM ('MATERNITE', 'CASE_SANTE', 'PREFECTURE', 'HOPITAL', 'AUTRE');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('EN_ATTENTE', 'SUCCES', 'ECHEC');

-- CreateEnum
CREATE TYPE "BlockchainTxStatus" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'ECHEC');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('PHOTO_CNI', 'PHOTO_CARNET', 'PHOTO_AUTRE', 'PDF_AUTRE');

-- CreateTable
CREATE TABLE "prefectures" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "region" VARCHAR(150),
    "code" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prefectures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communes" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "prefecture_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sous_prefectures" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "prefecture_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sous_prefectures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(150) NOT NULL,
    "sous_prefecture_id" UUID,
    "commune_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(120) NOT NULL,
    "prenom" VARCHAR(120),
    "email" VARCHAR(180),
    "telephone" VARCHAR(30),
    "mot_de_passe_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "derniere_connexion_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centres" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(180) NOT NULL,
    "type" "CenterType" NOT NULL,
    "prefecture_id" UUID,
    "commune_id" UUID,
    "sous_prefecture_id" UUID,
    "village_id" UUID,
    "adresse" TEXT,
    "coordonnees_gps" VARCHAR(120),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "matricule" VARCHAR(80),
    "centre_id" UUID,
    "fonction" VARCHAR(120),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naissances" (
    "id" UUID NOT NULL,
    "numero_certificat" VARCHAR(100),
    "numero_identification_national" VARCHAR(100),
    "identifiant_unique_national" VARCHAR(100),
    "agent_id" UUID NOT NULL,
    "centre_id" UUID,
    "prefecture_administrative_id" UUID,
    "commune_id" UUID,
    "village_id" UUID,
    "statut" "BirthStatus" NOT NULL DEFAULT 'BROUILLON',
    "date_dresse" DATE,
    "officier_etat_civil_nom" VARCHAR(180),
    "approuve_par" VARCHAR(180),
    "commentaire_rejet" TEXT,
    "hash_blockchain" TEXT,
    "qr_reference" TEXT,
    "date_creation_metier" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_validation" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naissances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enfants" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "prenoms" VARCHAR(180) NOT NULL,
    "nom" VARCHAR(120) NOT NULL,
    "region_naissance" VARCHAR(150),
    "prefecture_naissance_id" UUID,
    "sous_prefecture_naissance_id" UUID,
    "commune_naissance_id" UUID,
    "village_naissance_id" UUID,
    "lieu_naissance_libelle" VARCHAR(255),
    "date_naissance" DATE NOT NULL,
    "heure_naissance" TIME,
    "sexe" VARCHAR(20) NOT NULL,
    "nationalite" VARCHAR(100) DEFAULT 'Guinéenne',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enfants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "type" "ParentType" NOT NULL,
    "nom" VARCHAR(120) NOT NULL,
    "prenom" VARCHAR(120),
    "date_naissance" DATE,
    "numero_identification" VARCHAR(120),
    "cni_ou_autre" VARCHAR(120),
    "nationalite" VARCHAR(100),
    "profession" VARCHAR(120),
    "telephone" VARCHAR(30),
    "region_adresse" VARCHAR(150),
    "prefecture_adresse_id" UUID,
    "sous_prefecture_adresse_id" UUID,
    "commune_adresse_id" UUID,
    "quartier_district" VARCHAR(150),
    "secteur_village" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declarants" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "nom" VARCHAR(180) NOT NULL,
    "numero_identification" VARCHAR(120),
    "lien_parente" VARCHAR(120),
    "cni_ou_autre" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "declarants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces_jointes" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "nom_fichier" VARCHAR(255),
    "url_fichier" TEXT NOT NULL,
    "mime_type" VARCHAR(120),
    "taille_octets" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pieces_jointes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actes_numeriques" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "numero_acte" VARCHAR(100),
    "url_pdf" TEXT,
    "qr_code_data" TEXT,
    "qr_code_image_url" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "date_generation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actes_numeriques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions_blockchain" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "tx_hash" VARCHAR(255),
    "reseau_blockchain" VARCHAR(120),
    "bloc_numero" BIGINT,
    "horodatage_ancrage" TIMESTAMP(3),
    "statut" "BlockchainTxStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journaux_synchronisation" (
    "id" UUID NOT NULL,
    "naissance_id" UUID NOT NULL,
    "agent_id" UUID,
    "statut" "SyncStatus" NOT NULL,
    "tentatives" INTEGER NOT NULL DEFAULT 0,
    "message_erreur" TEXT,
    "date_dernier_essai" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journaux_synchronisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" UUID NOT NULL,
    "naissance_id" UUID,
    "moyen" VARCHAR(120) NOT NULL,
    "valeur_recherchee" VARCHAR(255),
    "resultat" VARCHAR(120) NOT NULL,
    "verifie_par_utilisateur_id" UUID,
    "organisme" VARCHAR(180),
    "adresse_ip" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journaux_audit" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID,
    "action" VARCHAR(180) NOT NULL,
    "type_entite" VARCHAR(120) NOT NULL,
    "entite_id" UUID,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journaux_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prefectures_nom_key" ON "prefectures"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "communes_nom_prefecture_id_key" ON "communes"("nom", "prefecture_id");

-- CreateIndex
CREATE UNIQUE INDEX "sous_prefectures_nom_prefecture_id_key" ON "sous_prefectures"("nom", "prefecture_id");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agents_utilisateur_id_key" ON "agents"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "agents_matricule_key" ON "agents"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "naissances_numero_certificat_key" ON "naissances"("numero_certificat");

-- CreateIndex
CREATE UNIQUE INDEX "naissances_numero_identification_national_key" ON "naissances"("numero_identification_national");

-- CreateIndex
CREATE UNIQUE INDEX "naissances_identifiant_unique_national_key" ON "naissances"("identifiant_unique_national");

-- CreateIndex
CREATE UNIQUE INDEX "enfants_naissance_id_key" ON "enfants"("naissance_id");

-- CreateIndex
CREATE UNIQUE INDEX "parents_naissance_id_type_key" ON "parents"("naissance_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "declarants_naissance_id_key" ON "declarants"("naissance_id");

-- CreateIndex
CREATE UNIQUE INDEX "actes_numeriques_naissance_id_key" ON "actes_numeriques"("naissance_id");

-- CreateIndex
CREATE UNIQUE INDEX "actes_numeriques_numero_acte_key" ON "actes_numeriques"("numero_acte");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_blockchain_naissance_id_key" ON "transactions_blockchain"("naissance_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_blockchain_tx_hash_key" ON "transactions_blockchain"("tx_hash");

-- AddForeignKey
ALTER TABLE "communes" ADD CONSTRAINT "communes_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "prefectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sous_prefectures" ADD CONSTRAINT "sous_prefectures_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "prefectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_sous_prefecture_id_fkey" FOREIGN KEY ("sous_prefecture_id") REFERENCES "sous_prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_commune_id_fkey" FOREIGN KEY ("commune_id") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centres" ADD CONSTRAINT "centres_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centres" ADD CONSTRAINT "centres_commune_id_fkey" FOREIGN KEY ("commune_id") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centres" ADD CONSTRAINT "centres_sous_prefecture_id_fkey" FOREIGN KEY ("sous_prefecture_id") REFERENCES "sous_prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "centres" ADD CONSTRAINT "centres_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "centres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naissances" ADD CONSTRAINT "naissances_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naissances" ADD CONSTRAINT "naissances_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "centres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naissances" ADD CONSTRAINT "naissances_prefecture_administrative_id_fkey" FOREIGN KEY ("prefecture_administrative_id") REFERENCES "prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naissances" ADD CONSTRAINT "naissances_commune_id_fkey" FOREIGN KEY ("commune_id") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naissances" ADD CONSTRAINT "naissances_village_id_fkey" FOREIGN KEY ("village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_prefecture_naissance_id_fkey" FOREIGN KEY ("prefecture_naissance_id") REFERENCES "prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_sous_prefecture_naissance_id_fkey" FOREIGN KEY ("sous_prefecture_naissance_id") REFERENCES "sous_prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_commune_naissance_id_fkey" FOREIGN KEY ("commune_naissance_id") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_village_naissance_id_fkey" FOREIGN KEY ("village_naissance_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_prefecture_adresse_id_fkey" FOREIGN KEY ("prefecture_adresse_id") REFERENCES "prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_sous_prefecture_adresse_id_fkey" FOREIGN KEY ("sous_prefecture_adresse_id") REFERENCES "sous_prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_commune_adresse_id_fkey" FOREIGN KEY ("commune_adresse_id") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarants" ADD CONSTRAINT "declarants_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_jointes" ADD CONSTRAINT "pieces_jointes_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actes_numeriques" ADD CONSTRAINT "actes_numeriques_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_blockchain" ADD CONSTRAINT "transactions_blockchain_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journaux_synchronisation" ADD CONSTRAINT "journaux_synchronisation_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journaux_synchronisation" ADD CONSTRAINT "journaux_synchronisation_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_naissance_id_fkey" FOREIGN KEY ("naissance_id") REFERENCES "naissances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_verifie_par_utilisateur_id_fkey" FOREIGN KEY ("verifie_par_utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journaux_audit" ADD CONSTRAINT "journaux_audit_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
