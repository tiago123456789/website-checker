import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Website Checker',
    template: '%s | Website Checker',
  },
  description:
    'Check website links from SaaS or Micro-SaaS to make sure they are working',
  applicationName: 'Website Checker',
  keywords: [
    'website checker',
    'link checker',
    'broken links',
    'SaaS',
    'Micro-SaaS',
    'uptime',
    'monitoring',
    'SEO',
    'site audit',
  ],
  authors: [
    { name: 'Tiago Rosa da Costa', url: 'mailto:tiagorosadacost@gmail.com' },
  ],
  creator: 'Tiago Rosa da Costa',
  publisher: 'Tiago Rosa da Costa',
  referrer: 'origin-when-cross-origin',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Website Checker',
    description:
      'Check website links from SaaS or Micro-SaaS to make sure they are working',
    url: '/',
    siteName: 'Website Checker',
    images: [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Checker',
    description:
      'Check website links from SaaS or Micro-SaaS to make sure they are working',
    creator: 'Tiago Rosa da Costa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0b' },
  ],
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <footer className="text-center mb-2">Created by Tiago rosa da costa&lt;tiagorosadacost@gmail.com&gt;</footer>
        <Analytics />
      </body>
    </html>
  )
}
