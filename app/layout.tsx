import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سِجل - كل اشتراكاتك في مكان واحد',
  description: 'سِجل ينبهك قبل تجديد اشتراكاتك عشان ما تتفاجأ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
