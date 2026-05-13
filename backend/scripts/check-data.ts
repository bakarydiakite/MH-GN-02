import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== VÉRIFICATION DES DONNÉES ===\n');
  
  // Compter les actes
  const totalBirths = await prisma.birthRecord.count();
  const pending = await prisma.birthRecord.count({ where: { statut: 'EN_ATTENTE' } });
  const validated = await prisma.birthRecord.count({ where: { statut: 'VALIDE' } });
  const rejected = await prisma.birthRecord.count({ where: { statut: 'REJETE' } });
  
  console.log(`📊 Actes de naissance:`);
  console.log(`   Total: ${totalBirths}`);
  console.log(`   En attente: ${pending}`);
  console.log(`   Validés: ${validated}`);
  console.log(`   Rejetés: ${rejected}`);
  
  // Compter les utilisateurs
  const users = await prisma.user.count();
  console.log(`\n👥 Utilisateurs: ${users}`);
  
  // Compter les centres
  const centers = await prisma.center.count();
  console.log(`🏥 Centres: ${centers}`);
  
  // Vérifier les agents
  const agents = await prisma.agent.findMany({
    include: { user: true, center: true }
  });
  console.log(`\n👔 Agents:`);
  for (const agent of agents) {
    console.log(`   - ${agent.user?.prenom} ${agent.user?.nom} (${agent.user?.role}) -> Centre: ${agent.center?.nom || 'Non assigné'}`);
  }
  
  // Vérifier les transactions blockchain
  const blockchainTx = await prisma.blockchainTransaction.count();
  console.log(`\n🔗 Transactions blockchain: ${blockchainTx}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
