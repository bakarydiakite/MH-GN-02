import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- LISTE DES ENFANTS ET LEURS PARENTS ---\n');
  
  const naissances = await prisma.birthRecord.findMany({
    include: {
      enfant: true,
      parents: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  if (naissances.length === 0) {
    console.log('Aucun enregistrement trouvé.');
  }

  naissances.forEach((n, index) => {
    console.log(`[${index + 1}] Enfant: ${n.enfant?.prenoms} ${n.enfant?.nom}`);
    console.log(`    Statut: ${n.statut}`);
    console.log(`    Parents:`);
    n.parents.forEach(p => {
      console.log(`      - ${p.type}: ${p.prenom} ${p.nom} | Tel: ${p.telephone || 'VIDE'}`);
    });
    console.log('------------------------------------------');
  });

  console.log('\n--- LISTE DES UTILISATEURS (COMPTES) ---\n');
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  users.forEach(u => {
    console.log(`- ${u.role}: ${u.prenom} ${u.nom} | Email/Tel: ${u.email || u.telephone}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
