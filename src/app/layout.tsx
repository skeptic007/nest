import type { Metadata } from 'next';

import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from 'store/ProviderWrapper';

export const metadata: Metadata = {
  title: 'EB SPACE WEBAPP',
  description:
    'Start your next React project with Berry admin template. It build with Reactjs, Material-UI, Redux, and Hook for faster web development.'
};

// ==============================|| ROOT LAYOUT ||============================== //

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
