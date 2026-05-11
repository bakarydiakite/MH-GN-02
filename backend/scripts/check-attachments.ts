import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérifier les actes
  const records = await prisma.birthRecord.findMany({
    include: {
      enfant: true,
      attachments: true,
    },
    take: 5,
  });

  console.log(`\n=== ACTES DE NAISSANCE (${records.length}) ===\n`);
  
  for (const record of records) {
    console.log(`Acte: ${record.identifiantUniqueNational}`);
    console.log(`  Enfant: ${record.enfant?.prenoms} ${record.enfant?.nom}`);
    console.log(`  Statut: ${record.statut}`);
    console.log(`  Pièces jointes: ${record.attachments.length}`);
    for (const att of record.attachments) {
      console.log(`    - ${att.type}: ${att.urlFichier?.substring(0, 50)}...`);
    }
    console.log('');
  }

  // Vérifier toutes les pièces jointes
  const allAttachments = await prisma.attachment.findMany();
  console.log(`\n=== TOTAL PIÈCES JOINTES: ${allAttachments.length} ===\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
