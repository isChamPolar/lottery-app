import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    try {
      const userId = crypto.randomBytes(16).toString('base64url');
      
      // キャッシュを無効化するヘッダーを付与
      return NextResponse.json(
        { userId },
        {
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    } catch (error) {
      console.error('Error generating user ID:', error);
      return NextResponse.json(
        { error: 'ユーザーIDの生成中にエラーが発生しました' },
        { status: 500 }
      );
    }
  }