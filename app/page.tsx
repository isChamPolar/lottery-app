'use client';

import { useState, useEffect } from 'react';
import StatusDisplay from './components/StatusDisplay';

const STORAGE_KEY = 'lottery_entry';

type LotteryEntry = {
  userId: string;
  result: any;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // ローカルストレージから既存のエントリーを確認
    const storedEntry = localStorage.getItem(STORAGE_KEY);
    if (storedEntry) {
      const entry: LotteryEntry = JSON.parse(storedEntry);
      setUserId(entry.userId);
      setResult(entry.result);
    } else {
      const newUserId = crypto.randomUUID();
      setUserId(newUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/lottery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setResult(data);

      // 結果をローカルストレージに保存
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userId,
        result: data,
      }));
    } catch (err) {
      setError('抽選処理中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-center mb-8">抽選アプリ</h1>
          
          {!result ? (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">あなたの抽選ID:</p>
                <p className="font-mono text-lg">{userId || '読み込み中...'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <button
                  type="submit"
                  disabled={loading || !userId}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? '抽選中...' : '抽選する'}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{result.message}</h2>
                {result.entry && (
                  <div className="space-y-2">
                    {result.entry.isWinner && (
                      <p className="text-lg font-medium text-green-600">
                        当選番号: {result.entry.winningNumber}
                      </p>
                    )}
                    <p>
                      景品: {result.entry.prize.name}
                    </p>
                    <p>
                      抽選日時: {new Date(result.entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                ※ブラウザのローカルストレージに結果を保存しています
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 rounded-md text-red-700">
              {error}
            </div>
          )}
        </div>

        <StatusDisplay />
      </div>
    </main>
  );
}
