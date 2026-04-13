import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Event Sync AI',
  description: 'Proactive logical decision-making for large-scale sporting venues.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
