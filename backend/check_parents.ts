
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const parents = await prisma.parent.findMany({
    select: {
      nom: true,
      prenom: true,
      telephone: true,
      naissance: {
        select: {
          enfant: {
            select: { prenoms: true, nom: true }
          }
        }
      }
    }
  });

  console.log('=== ETAT DES PARENTS DANS LA DB ===');
  if (parents.length === 0) {
    console.log('Aucun parent trouvé.');
  }
  parents.forEach(p => {
    console.log(`Parent: ${p.prenom} ${p.nom}`);
    console.log(` > Tel: "${p.telephone || 'VIDE'}"`);
    if (p.naissance?.enfant) {
       console.log(` > Enfant lié: ${p.naissance.enfant.prenoms} ${p.naissance.enfant.nom}`);
    }
    console.log('---------------------------');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
