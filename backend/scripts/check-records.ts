import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== VÉRIFICATION DES ACTES PAR CENTRE ===\n');
  
  // Récupérer tous les centres
  const centers = await prisma.center.findMany();
  
  console.log('🏥 Centres:');
  for (const center of centers) {
    const count = await prisma.birthRecord.count({ where: { centerId: center.id } });
    console.log(`   ${center.nom}: ${count} actes`);
  }
  
  // Récupérer les actes avec leur centre
  const records = await prisma.birthRecord.findMany({
    include: {
      center: true,
      enfant: true
    }
  });
  
  console.log('\n📄 Détail des actes:');
  for (const record of records) {
    console.log(`   - ${record.enfant?.prenoms} ${record.enfant?.nom} → Centre: ${record.center?.nom || 'Non assigné'}`);
  }
  
  // Vérifier le superviseur
  const superviseur = await prisma.user.findUnique({
    where: { email: 'superviseur@naissancechain.gn' },
    include: { agent: { include: { center: true } } }
  });
  
  console.log('\n👤 Superviseur:');
  console.log(`   ${superviseur?.prenom} ${superviseur?.nom}`);
  console.log(`   Centre assigné: ${superviseur?.agent?.center?.nom || 'Non assigné'}`);
  console.log(`   Centre ID: ${superviseur?.agent?.centerId || 'Non assigné'}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
