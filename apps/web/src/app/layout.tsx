import { PropsWithChildren } from 'react';

import Navbar from './Navbar';
import Footer from '../core/components/Footer';

import '../core/styles/global.css';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <div className="h-screen">
          <div className="max-w-[450px] m-auto p-4 flex-col space-y-4 rounded-lg shadow-lg">
            <header>
              <Navbar />
            </header>
            <main className="h-full">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
