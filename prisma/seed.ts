import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 既存の景品を削除
  await prisma.lotteryEntry.deleteMany();
  await prisma.prize.deleteMany();

  // 景品を作成
  const prize = await prisma.prize.create({
    data: {
      name: '特製オリジナルグッズ',
      stockCount: 50,
    },
  });

  console.log('Seeding completed:', { prize });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 