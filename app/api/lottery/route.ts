import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
    }

    // 既存のエントリーを確認
    const existingEntry = await prisma.lotteryEntry.findFirst({
      where: {
        userId: userId,
      },
      include: {
        prize: true,
      },
    });

    if (existingEntry) {
      return NextResponse.json({
        message: '既に抽選に参加済みです',
        entry: existingEntry,
      });
    }

    // 在庫のある景品を取得
    const availablePrize = await prisma.prize.findFirst({
      where: {
        stockCount: {
          gt: 0,
        },
      },
    });

    if (!availablePrize) {
      return NextResponse.json({ message: '申し訳ありません。景品の在庫が終了しました。' });
    }

    // 当選確率50%で抽選
    const isWinner = Math.random() < 0.5;

    if (!isWinner) {
      const entry = await prisma.lotteryEntry.create({
        data: {
          userId,
          isWinner: false,
          prizeId: availablePrize.id,
        },
        include: {
          prize: true,
        },
      });
      return NextResponse.json({ message: '残念ながら落選しました', entry });
    }

    // 当選番号を割り当て
    const winningEntries = await prisma.lotteryEntry.count({
      where: {
        isWinner: true,
      },
    });

    const winningNumber = winningEntries + 1;

    // 在庫を減らして当選エントリーを作成
    const [updatedPrize, entry] = await prisma.$transaction([
      prisma.prize.update({
        where: { id: availablePrize.id },
        data: { stockCount: availablePrize.stockCount - 1 },
      }),
      prisma.lotteryEntry.create({
        data: {
          userId,
          isWinner: true,
          winningNumber,
          prizeId: availablePrize.id,
        },
        include: {
          prize: true,
        },
      }),
    ]);

    return NextResponse.json({
      message: 'おめでとうございます！当選しました！',
      entry,
      winningNumber,
    });

  } catch (error) {
    console.error('Error in lottery API:', error);
    return NextResponse.json(
      { error: '抽選処理中にエラ��が発生しました' },
      { status: 500 }
    );
  }
} 