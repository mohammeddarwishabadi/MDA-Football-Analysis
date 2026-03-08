import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './providers';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-heading' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: {
    default: 'MDA | Football Analysis',
    template: '%s | MDA | Football Analysis'
  },
  description: 'Football truth through data: match analysis, predictions, and visual insights.',
  openGraph: {
    title: 'MDA | Football Analysis',
    description: 'Football truth through data: match analysis, predictions, and visual insights.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
