import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  console.log('🧹 Limpando dados existentes...');

  // IMPORTANTE: Ordem correta para evitar constraints de chave estrangeira
  // Primeiro excluir as tabelas que dependem de outras

  // 1. Começar pelas tabelas mais dependentes
  await prisma.betPick.deleteMany();
  await prisma.betSlip.deleteMany();
  await prisma.match.deleteMany();
  await prisma.widthdrawls.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.notification.deleteMany();

  await prisma.user.deleteMany({
    where: { role: 'CLIENT' },
  });

  const adminPhone = process.env.ADMIN_PHONE ?? '955555500';
  const adminExists = await prisma.user.findUnique({
    where: { phone: adminPhone },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        phone: adminPhone,
        password: bcrypt.hashSync(process.env.ADMIN_PASS ?? '1234567890', 10),
        role: 'ADMIN',
        balance: 100000,
        isActive: true,
      },
    });
    console.log('👑 Usuário admin criado');
  } else {
    console.log('👑 Usuário admin já existe');
  }

  const clients = [
    {
      name: 'João Silva',
      phone: '955555502',
      password: bcrypt.hashSync(process.env.ADMIN_PASS ?? '1234567890', 10),
      balance: 5000,
    },
    {
      name: 'Maria Santos',
      phone: '955555503',
      password: bcrypt.hashSync(process.env.ADMIN_PASS ?? '1234567890', 10),
      balance: 3000,
    },
    {
      name: 'Carlos Oliveira',
      phone: '955555504',
      password: bcrypt.hashSync(process.env.ADMIN_PASS ?? '1234567890', 10),
      balance: 7500,
    },
  ];

  for (const client of clients) {
    const exists = await prisma.user.findUnique({
      where: { phone: client.phone },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          ...client,
          role: 'CLIENT',
          isActive: true,
        },
      });
    }
  }

  console.log('✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
