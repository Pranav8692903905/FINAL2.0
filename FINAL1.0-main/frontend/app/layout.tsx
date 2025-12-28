import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Smart Resume Analyzer',
  description: 'Analyze and get insights about resumes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
