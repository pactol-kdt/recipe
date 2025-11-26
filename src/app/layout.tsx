import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Love, Cheewi Monitoring',
  description: 'Track recipes, ingredients, expenses, and sales',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#ff809e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-accent-foreground antialiased`}>{children}</body>
    </html>
  );
}
