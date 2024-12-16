import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "抽選アプリ",
  description: "オリジナルグッズが当たる抽選アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
