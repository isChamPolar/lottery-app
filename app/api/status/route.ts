import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Fetching status...');
    const [prize, totalEntries, winnerCount] = await Promise.all([
      prisma.prize.findFirst(),
      prisma.lotteryEntry.count(),
      prisma.lotteryEntry.count({
        where: {
          isWinner: true
        }
      })
    ]);

    console.log('Status fetched:', { prize, totalEntries, winnerCount });
    return NextResponse.json({
      prize,
      totalEntries,
      winnerCount,
      remainingStock: prize?.stockCount || 0,
    }, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'ステータスの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 