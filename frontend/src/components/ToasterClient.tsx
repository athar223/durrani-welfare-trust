'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: { background: '#1a6b3c', color: 'white' },
        success: { iconTheme: { primary: 'white', secondary: '#1a6b3c' } },
        error: { style: { background: '#dc2626' } },
      }}
    />
  );
}
