import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Récupérer le superviseur
  const superviseur = await prisma.user.findUnique({
    where: { email: 'superviseur@naissancechain.gn' },
  });

  if (!superviseur) {
    console.log('❌ Superviseur non trouvé');
    return;
  }

  // Récupérer le centre 1
  const centre = await prisma.center.findFirst();

  if (!centre) {
    console.log('❌ Aucun centre trouvé');
    return;
  }

  // Vérifier si le superviseur a déjà un profil agent
  const existingAgent = await prisma.agent.findFirst({
    where: { utilisateurId: superviseur.id },
  });

  if (existingAgent) {
    // Mettre à jour le centre
    await prisma.agent.update({
      where: { id: existingAgent.id },
      data: { centerId: centre.id },
    });
    console.log(`✅ Superviseur ${superviseur.prenom} ${superviseur.nom} mis à jour - Centre: ${centre.nom}`);
  } else {
    // Créer un nouveau profil agent
    const agent = await prisma.agent.create({
      data: {
        id: randomUUID(),
        utilisateurId: superviseur.id,
        centerId: centre.id,
        matricule: 'SUP-2024-001',
        fonction: 'Superviseur',
      },
    });
    console.log(`✅ Superviseur ${superviseur.prenom} ${superviseur.nom} assigné au centre: ${centre.nom}`);
  }
  
  console.log(`   Centre ID: ${centre.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
