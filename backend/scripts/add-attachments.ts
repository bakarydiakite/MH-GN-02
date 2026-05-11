import { PrismaClient, AttachmentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Récupérer tous les actes sans pièces jointes
  const records = await prisma.birthRecord.findMany({
    where: {
      attachments: { none: {} }
    },
    include: { _count: { select: { attachments: true } } }
  });

  console.log(`Trouvé ${records.length} actes sans pièces jointes`);

  // Ajouter des pièces jointes fictives à chaque acte
  for (const record of records) {
    // Générer une URL fictive pour les pièces jointes
    const baseUrl = 'https://via.placeholder.com/400x300';
    
    await prisma.attachment.createMany({
      data: [
        {
          naissanceId: record.id,
          type: AttachmentType.PHOTO_CARNET,
          urlFichier: `${baseUrl}/4CAF50/FFFFFF?text=Carnet+Maternite`,
          nomFichier: 'carnet_maternite.jpg',
          mimeType: 'image/jpeg',
        },
        {
          naissanceId: record.id,
          type: AttachmentType.PHOTO_CNI,
          urlFichier: `${baseUrl}/2196F3/FFFFFF?text=CNI+Mere`,
          nomFichier: 'cni_mere.jpg',
          mimeType: 'image/jpeg',
        },
        ...(Math.random() > 0.3 ? [{
          naissanceId: record.id,
          type: AttachmentType.PHOTO_CNI,
          urlFichier: `${baseUrl}/FF9800/FFFFFF?text=CNI+Pere`,
          nomFichier: 'cni_pere.jpg',
          mimeType: 'image/jpeg',
        }] : []),
      ]
    });

    console.log(`✓ Pièces jointes ajoutées à l'acte ${record.identifiantUniqueNational || record.id}`);
  }

  console.log('Terminé !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
