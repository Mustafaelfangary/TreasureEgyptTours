// prisma/check-admin-role.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAndUpdateAdminRole() {
  try {
    // Replace with your admin email
    const adminEmail = 'dark1devil2025@outlook.com';
    
    // Check if user exists and get current role
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { 
        id: true, 
        email: true,
        role: true 
      }
    });

    if (!user) {
      console.log('Admin user not found');
      return;
    }

    console.log('Current user role:', user.role);

    // Update role to ADMIN if not already set
    if (user.role !== 'ADMIN') {
      console.log('Updating role to ADMIN...');
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
      console.log('Role updated to ADMIN');
    } else {
      console.log('User already has ADMIN role');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateAdminRole();
