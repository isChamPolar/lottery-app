import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [prize, totalEntries, winnerCount] = await Promise.all([
      prisma.prize.findFirst(),
      prisma.lotteryEntry.count(),
      prisma.lotteryEntry.count({
        where: {
          isWinner: true
        }
      })
    ]);

    return NextResponse.json({
      prize,
      totalEntries,
      winnerCount,
      remainingStock: prize?.stockCount || 0,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'ステータスの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 