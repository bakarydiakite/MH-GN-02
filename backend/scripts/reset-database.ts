import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Suppression de toutes les données...\n');

  // Supprimer dans l'ordre pour respecter les relations
  const tables = [
    'journaux_audit',
    'verifications',
    'transactions_blockchain',
    'actes_numeriques',
    'pieces_jointes',
    'declarants',
    'parents',
    'enfants',
    'journaux_synchronisation',
    'naissances',
    'agents',
    'centres',
    'utilisateurs',
    'villages',
    'sous_prefectures',
    'communes',
    'prefectures',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM ${table}`);
      console.log(`✓ Table ${table} vidée`);
    } catch (e: any) {
      if (e.code === '42P01') {
        console.log(`⊘ Table ${table} n'existe pas`);
      } else {
        console.log(`⚠ Erreur ${table}: ${e.message}`);
      }
    }
  }

  // Réinitialiser les séquences
  try {
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('utilisateurs', 'id'), 1, false);
      SELECT setval(pg_get_serial_sequence('naissances', 'id'), 1, false);
    `);
    console.log('\n✓ Séquences réinitialisées');
  } catch (e) {
    console.log('⚠ Erreur réinitialisation séquences');
  }

  console.log('\n✅ Base de données nettoyée avec succès !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
