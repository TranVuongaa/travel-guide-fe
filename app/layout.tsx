import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google';

import {AppFooter} from '@/components/layout/AppFooter';
import {AppHeader} from '@/components/layout/AppHeader';

import {AppProviders} from './providers';

import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vạn Nẻo — Cẩm nang du hành Việt Nam',
    template: '%s — Vạn Nẻo',
  },
  description:
    'Những chỉ dẫn được tuyển chọn để đi sâu hơn vào cảnh sắc, văn hóa và nhịp sống bản địa Việt Nam.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='vi'
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${notoSerif.variable} antialiased`}
    >
      <body suppressHydrationWarning>
        <AppProviders>
          <a href='#main-content' className='skip-link'>
            Bỏ qua đến nội dung
          </a>
          <AppHeader />
          <main id='main-content'>{children}</main>
          <AppFooter />
        </AppProviders>
      </body>
    </html>
  );
}
