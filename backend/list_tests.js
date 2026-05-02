
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const children = await prisma.enfant.findMany({
    include: {
      registreNaissance: {
        include: {
          pere: true,
          mere: true
        }
      }
    }
  });

  console.log('=== LISTE POUR VOS TESTS ===');
  children.forEach(c => {
    const pereTel = c.registreNaissance?.pere?.telephone || 'N/A';
    const mereTel = c.registreNaissance?.mere?.telephone || 'N/A';
    console.log(`Enfant: ${c.prenoms} ${c.nom}`);
    console.log(` > Tel Pere: ${pereTel}`);
    console.log(` > Tel Mere: ${mereTel}`);
    console.log('---------------------------');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
