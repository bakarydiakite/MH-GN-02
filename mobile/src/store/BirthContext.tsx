import React, { createContext, useContext, useState, ReactNode } from 'react';

// Structure alignée sur le modèle d'extrait biométrique guinéen
export interface BirthFormData {
  // --- ENFANT ---
  prenomsEnfant: string;
  nomEnfant: string;
  dateNaissanceEnfant: string;
  heureNaissanceEnfant: string;
  sexeEnfant: 'MASCULIN' | 'FEMININ';
  nationaliteEnfant: string;
  
  regionNaissance: string;
  prefectureNaissance: string;
  sousPrefectureNaissance: string;
  villageNaissance?: string;
  lieuNaissanceLibelle?: string;

  // --- PÈRE ---
  nomPere: string;
  dateNaissancePere: string;
  professionPere: string;
  nationalitePere: string;
  idNationalPere: string;
  cniPere: string;
  telephonePere: string;

  // --- MÈRE ---
  nomMere: string;
  dateNaissanceMere: string;
  professionMere: string;
  nationaliteMere: string;
  idNationalMere: string;
  cniMere: string;
  telephoneMere: string;

  // Adresse Parents
  regionParents: string;
  prefectureParents: string;
  sousPrefectureParents: string;
  quartierParents: string;
  secteurParents: string;

  // --- DÉCLARANT ---
  nomDeclarant: string;
  idNationalDeclarant: string;
  cniDeclarant: string;
  lienParenteDeclarant: string;

  // --- DOCUMENTS ---
  attachments?: {
    carnet_maternite?: string;
    cni_mere?: string;
    cni_pere?: string;
    acte_mariage?: string;
  };
}

interface BirthContextType {
  formData: Partial<BirthFormData>;
  updateFormData: (data: Partial<BirthFormData>) => void;
  resetForm: () => void;
}

const BirthContext = createContext<BirthContextType | undefined>(undefined);

export const BirthProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<Partial<BirthFormData>>({});

  const updateFormData = (data: Partial<BirthFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({});
  };

  return (
    <BirthContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </BirthContext.Provider>
  );
};

export const useBirthForm = () => {
  const context = useContext(BirthContext);
  if (context === undefined) {
    throw new Error('useBirthForm must be used within a BirthProvider');
  }
  return context;
};
