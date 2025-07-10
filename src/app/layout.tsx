import '@/styles/global.css';
import { ReactNode } from 'react';


export const metadata = {
  title: 'Product App',
  description: 'DummyJSON-based Next.js product app',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        
          {children}
        
      </body>
    </html>
  );
}
