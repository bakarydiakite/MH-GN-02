
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, telephone: true, role: true }
  });
  console.log('--- USERS IN DB ---');
  console.log(users);
  
  const parents = await prisma.parent.findMany({
    select: { nom: true, prenom: true, telephone: true }
  });
  console.log('--- PARENTS IN DB ---');
  console.log(parents);
}

main().catch(console.error).finally(() => prisma.$disconnect());
