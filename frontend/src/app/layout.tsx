import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Durrani Welfare Trust - Serving Humanity with Compassion',
  description: 'A non-profit organization dedicated to education, healthcare, and community development programs.',
  keywords: 'NGO, Pakistan, welfare, education, healthcare, donations, volunteer, charity',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1a6b3c', color: 'white' },
            success: { iconTheme: { primary: 'white', secondary: '#1a6b3c' } },
            error: { style: { background: '#dc2626' } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
