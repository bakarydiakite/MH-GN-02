const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.birthRecord.count();
  console.log('Total BirthRecords:', count);
  
  const recent = await prisma.birthRecord.findMany({
    take: 5,
    include: { enfant: true }
  });
  console.log('Recent Records:', JSON.stringify(recent, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
