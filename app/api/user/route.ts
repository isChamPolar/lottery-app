import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    // ランダムな16バイトの文字列を生成し、base64エンコード
    const userId = crypto.randomBytes(16).toString('base64url');
    
    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Error generating user ID:', error);
    return NextResponse.json(
      { error: 'ユーザーIDの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 