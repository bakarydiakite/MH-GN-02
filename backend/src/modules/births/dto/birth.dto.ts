import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBirthDto {
  // --- ENFANT ---
  @IsString() @IsNotEmpty() prenomsEnfant: string;
  @IsString() @IsNotEmpty() nomEnfant: string;
  @IsString() @IsNotEmpty() dateNaissanceEnfant: string;
  @IsString() @IsOptional() heureNaissanceEnfant?: string;
  @IsString() @IsNotEmpty() sexeEnfant: 'MASCULIN' | 'FEMININ';
  @IsString() @IsOptional() nationaliteEnfant?: string;
  
  // Lieu Naissance (Libellés)
  @IsString() @IsOptional() regionNaissance?: string;
  @IsString() @IsOptional() prefectureNaissance?: string;
  @IsString() @IsOptional() sousPrefectureNaissance?: string;
  @IsString() @IsOptional() villageNaissance?: string;
  @IsString() @IsOptional() lieuNaissanceLibelle?: string;
  
  // Lieu Naissance (IDs pour liaison DB si existants)
  @IsUUID() @IsOptional() prefectureNaissanceId?: string;
  @IsUUID() @IsOptional() sousPrefectureNaissanceId?: string;
  @IsUUID() @IsOptional() communeNaissanceId?: string;
  @IsUUID() @IsOptional() villageNaissanceId?: string;

  // --- MÈRE ---
  @IsString() @IsNotEmpty() nomMere: string;
  @IsString() @IsOptional() prenomMere?: string;
  @IsString() @IsOptional() dateNaissanceMere?: string;
  @IsString() @IsOptional() professionMere?: string;
  @IsString() @IsOptional() nationaliteMere?: string;
  @IsString() @IsOptional() idNationalMere?: string;
  @IsString() @IsOptional() cniMere?: string;
  @IsString() @IsOptional() telephoneMere?: string;

  // --- PÈRE ---
  @IsString() @IsOptional() nomPere?: string;
  @IsString() @IsOptional() prenomPere?: string;
  @IsString() @IsOptional() dateNaissancePere?: string;
  @IsString() @IsOptional() professionPere?: string;
  @IsString() @IsOptional() nationalitePere?: string;
  @IsString() @IsOptional() idNationalPere?: string;
  @IsString() @IsOptional() cniPere?: string;
  @IsString() @IsOptional() telephonePere?: string;

  // Adresse Parents
  @IsString() @IsOptional() regionParents?: string;
  @IsString() @IsOptional() prefectureParents?: string;
  @IsString() @IsOptional() sousPrefectureParents?: string;
  @IsString() @IsOptional() quartierParents?: string;
  @IsString() @IsOptional() secteurParents?: string;

  // --- DÉCLARANT ---
  @IsString() @IsOptional() nomDeclarant?: string;
  @IsString() @IsOptional() idNationalDeclarant?: string;
  @IsString() @IsOptional() cniDeclarant?: string;
  @IsString() @IsOptional() lienParenteDeclarant?: string;

  // --- PIÈCES JOINTES (Base64) ---
  @IsString() @IsOptional() carnetMaternite?: string;
  @IsString() @IsOptional() cniMerePhoto?: string;
  @IsString() @IsOptional() cniPerePhoto?: string;
  @IsString() @IsOptional() acteMariagePhoto?: string;

  // --- Géolocalisation enregistrement (agent sur le terrain) ---
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  enregistrementLatitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  enregistrementLongitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  enregistrementPrecisionM?: number;
}

export class ValidateBirthDto {
  @IsString() @IsOptional() commentaireRejet?: string;
}

/** Rejet superviseur : motif obligatoire (affiché à l’agent). */
export class RejectBirthDto {
  @IsString()
  @IsNotEmpty()
  motif!: string;
}

/** Mise à jour d’un dossier rejeté par l’agent (champs partiels). */
export class UpdateRejectedBirthDto {
  @IsString() @IsOptional() prenomsEnfant?: string;
  @IsString() @IsOptional() nomEnfant?: string;
  @IsString() @IsOptional() dateNaissanceEnfant?: string;
  @IsString() @IsOptional() heureNaissanceEnfant?: string;
  @IsString() @IsOptional() sexeEnfant?: 'MASCULIN' | 'FEMININ';
  @IsString() @IsOptional() nationaliteEnfant?: string;
  @IsString() @IsOptional() regionNaissance?: string;
  @IsString() @IsOptional() lieuNaissanceLibelle?: string;
  @IsUUID() @IsOptional() prefectureNaissanceId?: string;
  @IsUUID() @IsOptional() sousPrefectureNaissanceId?: string;
  @IsUUID() @IsOptional() communeNaissanceId?: string;
  @IsUUID() @IsOptional() villageNaissanceId?: string;

  @IsString() @IsOptional() nomMere?: string;
  @IsString() @IsOptional() prenomMere?: string;
  @IsString() @IsOptional() dateNaissanceMere?: string;
  @IsString() @IsOptional() professionMere?: string;
  @IsString() @IsOptional() nationaliteMere?: string;
  @IsString() @IsOptional() idNationalMere?: string;
  @IsString() @IsOptional() cniMere?: string;
  @IsString() @IsOptional() telephoneMere?: string;

  @IsString() @IsOptional() nomPere?: string;
  @IsString() @IsOptional() prenomPere?: string;
  @IsString() @IsOptional() dateNaissancePere?: string;
  @IsString() @IsOptional() professionPere?: string;
  @IsString() @IsOptional() nationalitePere?: string;
  @IsString() @IsOptional() idNationalPere?: string;
  @IsString() @IsOptional() cniPere?: string;
  @IsString() @IsOptional() telephonePere?: string;

  @IsString() @IsOptional() regionParents?: string;
  @IsString() @IsOptional() quartierParents?: string;
  @IsString() @IsOptional() secteurParents?: string;

  @IsString() @IsOptional() nomDeclarant?: string;
  @IsString() @IsOptional() idNationalDeclarant?: string;
  @IsString() @IsOptional() cniDeclarant?: string;
  @IsString() @IsOptional() lienParenteDeclarant?: string;
}
