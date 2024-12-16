# 抽選アプリ

オリジナルグッズが当たる抽選アプリケーションです。

## 機能

- ユーザーごとに1回限りの抽選参加
- リアルタイムでの抽選結果表示
- 景品の在庫管理
- 当選番号の自動割り振り
- 抽選状況のリアルタイム表示

## 技術スタック

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Vercel

## ローカル開発環境のセットアップ

1. リポジトリのクローン:
```bash
git clone [repository-url]
cd lottery-app
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
```bash
cp .env.example .env
```

4. Dockerの起動:
```bash
docker-compose up -d
```

5. データベースのセットアップ:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

6. 開発サーバーの起動:
```bash
npm run dev
```

## デプロイ

このアプリケーションは[Vercel](https://vercel.com)にデプロイできます。

1. GitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. Vercel Postgresを追加
4. 自動的にデプロイが開始されます

## 環境変数

開発環境では`.env`ファイルに以下の環境変数を設定します：

- `POSTGRES_PRISMA_URL`: PostgreSQLのメイン接続URL
- `POSTGRES_URL_NON_POOLING`: PostgreSQLの直接接続URL（マイグレーション用）

## ライセンス

MIT
