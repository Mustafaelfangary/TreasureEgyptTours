import { PrismaClient } from '@prisma/client';

async function checkConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Try a simple query
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Found users:', users.length);
    
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection().catch(console.error);
