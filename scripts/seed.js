require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin User',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user: admin / admin123');

  // Create some cameras
  const cameras = [
    { name: 'Sony Alpha 1', serialNumber: 'SN-001' },
    { name: 'Canon R5', serialNumber: 'SN-002' },
    { name: 'GoPro Hero 10', serialNumber: 'SN-003' },
  ];

  for (const cam of cameras) {
    await prisma.camera.upsert({
      where: { serialNumber: cam.serialNumber },
      update: {},
      create: {
        name: cam.name,
        serialNumber: cam.serialNumber,
        status: 'AVAILABLE',
        holderId: admin.id, // Initially held by admin
      },
    });
  }

  console.log('Seeded cameras.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
