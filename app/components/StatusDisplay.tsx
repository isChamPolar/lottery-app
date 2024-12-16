import { useEffect, useState } from 'react';

type StatusData = {
  prize: {
    name: string;
    stockCount: number;
  };
  totalEntries: number;
  winnerCount: number;
  remainingStock: number;
};

export default function StatusDisplay() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.error || 'ステータスの取得に失敗しました');
      }
    } catch (err) {
      setError('ステータスの取得中にエラーが発生しました');
    }
  };

  useEffect(() => {
    fetchStatus();
    // 10秒ごとに更新
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!status) {
    return (
      <div className="animate-pulse bg-gray-100 p-4 rounded-lg">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">抽選状況</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">残り景品数</p>
          <p className="text-2xl font-bold text-blue-800">{status.remainingStock}個</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">当選者数</p>
          <p className="text-2xl font-bold text-green-800">{status.winnerCount}名</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600">総参加者数</p>
          <p className="text-2xl font-bold text-purple-800">{status.totalEntries}名</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">当選確率</p>
          <p className="text-2xl font-bold text-yellow-800">
            {status.totalEntries > 0
              ? Math.round((status.winnerCount / status.totalEntries) * 100)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
} 