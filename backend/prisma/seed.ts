import { PrismaClient, UserRole, BirthStatus, CenterType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// UUIDs valides
const UUID = {
  pref1: '550e8400-e29b-41d4-a716-446655440001',
  pref2: '550e8400-e29b-41d4-a716-446655440002',
  pref3: '550e8400-e29b-41d4-a716-446655440003',
  center1: '550e8400-e29b-41d4-a716-446655440010',
  center2: '550e8400-e29b-41d4-a716-446655440011',
  center3: '550e8400-e29b-41d4-a716-446655440012',
  userAdmin: '550e8400-e29b-41d4-a716-446655440020',
  userSuperviseur: '550e8400-e29b-41d4-a716-446655440021',
  userVerificateur: '550e8400-e29b-41d4-a716-446655440022',
  userAgent1: '550e8400-e29b-41d4-a716-446655440023',
  userAgent2: '550e8400-e29b-41d4-a716-446655440024',
  userFamille: '550e8400-e29b-41d4-a716-446655440025',
  agent1: '550e8400-e29b-41d4-a716-446655440030',
  agent2: '550e8400-e29b-41d4-a716-446655440031',
  birth1: '550e8400-e29b-41d4-a716-446655440040',
  birth2: '550e8400-e29b-41d4-a716-446655440041',
  birth3: '550e8400-e29b-41d4-a716-446655440042',
};

async function main() {
  console.log('🌱 Début du seeding...\n');

  // 1. Préfectures
  console.log('📍 Création des préfectures...');
  await Promise.all([
    prisma.prefecture.upsert({
      where: { id: UUID.pref1 },
      update: {},
      create: { id: UUID.pref1, nom: 'Kaloum', region: 'Conakry' },
    }),
    prisma.prefecture.upsert({
      where: { id: UUID.pref2 },
      update: {},
      create: { id: UUID.pref2, nom: 'Matoto', region: 'Conakry' },
    }),
    prisma.prefecture.upsert({
      where: { id: UUID.pref3 },
      update: {},
      create: { id: UUID.pref3, nom: 'Labé', region: 'Labé' },
    }),
  ]);
  console.log('   ✅ 3 préfectures créées\n');

  // 2. Centres
  console.log('🏥 Création des centres...');
  await Promise.all([
    prisma.center.upsert({
      where: { id: UUID.center1 },
      update: {},
      create: { id: UUID.center1, nom: 'Centre Principal Conakry', type: CenterType.HOPITAL, prefectureId: UUID.pref1, actif: true },
    }),
    prisma.center.upsert({
      where: { id: UUID.center2 },
      update: {},
      create: { id: UUID.center2, nom: 'Centre Matoto', type: CenterType.MATERNITE, prefectureId: UUID.pref2, actif: true },
    }),
    prisma.center.upsert({
      where: { id: UUID.center3 },
      update: {},
      create: { id: UUID.center3, nom: 'Centre Labé', type: CenterType.PREFECTURE, prefectureId: UUID.pref3, actif: true },
    }),
  ]);
  console.log('   ✅ 3 centres créés\n');

  // 3. Utilisateurs
  console.log('👥 Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@naissancechain.gn' },
      update: {},
      create: { id: UUID.userAdmin, email: 'admin@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Diallo', prenom: 'Mamadou', role: UserRole.ADMINISTRATEUR, telephone: '+224 620 00 00 01', actif: true },
    }),
    prisma.user.upsert({
      where: { email: 'superviseur@naissancechain.gn' },
      update: {},
      create: { id: UUID.userSuperviseur, email: 'superviseur@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Camara', prenom: 'Fatou', role: UserRole.SUPERVISEUR, telephone: '+224 620 00 00 02', actif: true },
    }),
    prisma.user.upsert({
      where: { email: 'verificateur@naissancechain.gn' },
      update: {},
      create: { id: UUID.userVerificateur, email: 'verificateur@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Bah', prenom: 'Oumar', role: UserRole.VERIFICATEUR, telephone: '+224 620 00 00 03', actif: true },
    }),
    prisma.user.upsert({
      where: { email: 'agent1@naissancechain.gn' },
      update: {},
      create: { id: UUID.userAgent1, email: 'agent1@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Dioubaté', prenom: 'Kémoko', role: UserRole.AGENT, telephone: '+224 620 00 00 04', actif: true },
    }),
    prisma.user.upsert({
      where: { email: 'agent2@naissancechain.gn' },
      update: {},
      create: { id: UUID.userAgent2, email: 'agent2@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Sow', prenom: 'Ibrahima', role: UserRole.AGENT, telephone: '+224 620 00 00 05', actif: true },
    }),
    prisma.user.upsert({
      where: { email: 'famille@naissancechain.gn' },
      update: {},
      create: { id: UUID.userFamille, email: 'famille@naissancechain.gn', motDePasseHash: hashedPassword, nom: 'Diallo', prenom: 'Aminata', role: UserRole.FAMILLE, telephone: '+224 620 00 00 06', actif: true },
    }),
  ]);
  console.log('   ✅ 6 utilisateurs créés\n');

  // 4. Agents
  console.log('👔 Création des profils agents...');
  await Promise.all([
    prisma.agent.upsert({
      where: { id: UUID.agent1 },
      update: {},
      create: { id: UUID.agent1, utilisateurId: UUID.userAgent1, centerId: UUID.center1, matricule: 'AG-2024-001', fonction: 'Officier d\'état civil' },
    }),
    prisma.agent.upsert({
      where: { id: UUID.agent2 },
      update: {},
      create: { id: UUID.agent2, utilisateurId: UUID.userAgent2, centerId: UUID.center2, matricule: 'AG-2024-002', fonction: 'Agent d\'état civil' },
    }),
    // Superviseur assigné au centre 1
    prisma.agent.upsert({
      where: { id: 'superviseur-agent-1' },
      update: {},
      create: { id: 'superviseur-agent-1', utilisateurId: UUID.userSuperviseur, centerId: UUID.center1, matricule: 'SUP-2024-001', fonction: 'Superviseur' },
    }),
  ]);
  console.log('   ✅ 3 agents créés (dont 1 superviseur)\n');

  // 5. Actes de naissance
  console.log('📄 Création des actes de démonstration...');
  await prisma.birthRecord.create({
    data: {
      id: UUID.birth1,
      agentId: UUID.agent1,
      centerId: UUID.center1,
      statut: BirthStatus.VALIDE,
      identifiantUniqueNational: 'GN-2024-001ABC',
      hashBlockchain: '0x1234567890abcdef',
      dateValidation: new Date(),
      approuvePar: UUID.userSuperviseur,
      enfant: {
        create: {
          prenoms: 'Bakary',
          nom: 'Diakité',
          dateNaissance: new Date('2024-01-15'),
          heureNaissance: new Date('1970-01-01T08:30:00Z'),
          sexe: 'MASCULIN',
          nationalite: 'Guinéenne',
          lieuNaissanceLibelle: 'Conakry, Kaloum',
        },
      },
      parents: {
        createMany: {
          data: [
            { type: 'MERE', nom: 'Diallo', prenom: 'Aminata', telephone: '+224 620 11 11 11' },
            { type: 'PERE', nom: 'Diakité', prenom: 'Ibrahima', telephone: '+224 620 22 22 22' },
          ],
        },
      },
      blockchainTx: {
        create: { txHash: '0xabcdef1234567890', statut: 'CONFIRMEE', reseauBlockchain: 'polygon-amoy', blocNumero: BigInt(12345678) },
      },
      acteNumerique: {
        create: { numeroActe: 'ACTE-GN-2024-001ABC', qrCodeData: 'GN-2024-001ABC' },
      },
    },
  });

  await prisma.birthRecord.create({
    data: {
      id: UUID.birth2,
      agentId: UUID.agent2,
      centerId: UUID.center2,
      statut: BirthStatus.EN_ATTENTE,
      identifiantUniqueNational: 'GN-2024-002DEF',
      enfant: {
        create: {
          prenoms: 'Fatoumata',
          nom: 'Camara',
          dateNaissance: new Date('2024-02-20'),
          heureNaissance: new Date('1970-01-01T14:00:00Z'),
          sexe: 'FEMININ',
          nationalite: 'Guinéenne',
          lieuNaissanceLibelle: 'Conakry, Matoto',
        },
      },
      parents: {
        createMany: {
          data: [{ type: 'MERE', nom: 'Camara', prenom: 'Mariama', telephone: '+224 620 33 33 33' }],
        },
      },
    },
  });

  await prisma.birthRecord.create({
    data: {
      id: UUID.birth3,
      agentId: UUID.agent1,
      centerId: UUID.center1,
      statut: BirthStatus.EN_ATTENTE,
      identifiantUniqueNational: 'GN-2024-003GHI',
      enfant: {
        create: {
          prenoms: 'Oumar',
          nom: 'Bah',
          dateNaissance: new Date('2024-03-10'),
          heureNaissance: new Date('1970-01-01T22:15:00Z'),
          sexe: 'MASCULIN',
          nationalite: 'Guinéenne',
          lieuNaissanceLibelle: 'Labé, Centre',
        },
      },
      parents: {
        createMany: {
          data: [
            { type: 'MERE', nom: 'Bah', prenom: 'Kadiatou', telephone: '+224 620 44 44 44' },
            { type: 'PERE', nom: 'Bah', prenom: 'Mohamed', telephone: '+224 620 55 55 55' },
          ],
        },
      },
    },
  });
  console.log('   ✅ 3 actes créés\n');

  console.log('🎉 Seeding terminé avec succès !\n');
  console.log('📋 Comptes de démonstration (mot de passe: password123):');
  console.log('   - admin@naissancechain.gn (Administrateur)');
  console.log('   - superviseur@naissancechain.gn (Superviseur)');
  console.log('   - verificateur@naissancechain.gn (Vérificateur)');
  console.log('   - agent1@naissancechain.gn (Agent)');
  console.log('   - agent2@naissancechain.gn (Agent)');
  console.log('   - famille@naissancechain.gn (Famille)\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
