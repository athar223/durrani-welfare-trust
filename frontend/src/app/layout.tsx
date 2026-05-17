import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Libre_Baskerville, Lato } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Durrani Welfare Trust - Be-Saharon Ka Sahara',
  description: 'Registered NGO in Gilgit-Baltistan sheltering 50+ orphan girls, running free ambulance services, empowering women, and serving thousands of families since 2017.',
  keywords: 'NGO, Pakistan, Gilgit-Baltistan, welfare, orphan girls, ambulance, women empowerment, donations, volunteer, charity, Durrani Welfare Trust',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/hero/banner.jpeg" as="image" fetchPriority="high" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${libreBaskerville.variable} ${lato.variable} bg-white text-gray-900 antialiased`}>
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
