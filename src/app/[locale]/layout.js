import "../globals.css";

import GoogleAnalytics from '../components/google/GoogleAnalytics';
import GoogleAdsense from '../components/google/GoogleAdsense';
import UmamiAnalytics from '../components/common/UmamiAnalytics';

import {Providers} from "../providers";

import MyNavbar from '../components/ui/MyNavbar';
import MyFooter from '../components/ui/MyFooter';


export const metadata = {
  title: {
    default: 'Twitter Marketing Blog Tool - Free Twitter Video Downloader',
    template: '%s | TwitterMarketingBlog'
  },
  description: 'Download Twitter/X.com videos and Re-twitt media content for marketing purpose for free. No registration required. Fast and easy Twitter video downloader. Twitter Media Editor.',
  keywords: 'twitter marketing tool, x.com video downloader',
  authors: [{ name: 'TwitterMarketingBlog' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://www.thetwittermarketingblog.com/',
  },
  openGraph: {
    title: 'Twitter Marketing Blog Tool - Free Twitter Video Downloader',
    description: 'Download Twitter/X.com videos and Re-twitt media content for marketing purpose for free. No registration required. Fast and easy Twitter video downloader. Twitter Media Editor.',
    type: 'website',
    url: 'https://www.thetwittermarketingblog.com',
    siteName: 'Twitter Marketing Blog Tool',
    images: [{
      url: 'https://www.thetwittermarketingblog.com/images/og.png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thetwittermarketingblog',
    title: 'Twitter Marketing Blog Tool - Free Twitter Video Downloader',
    description: 'Download Twitter/X.com videos and Re-twitt media content for marketing purpose for free. No registration required. Fast and easy Twitter video downloader. Twitter Media Editor.',
    images: ['https://www.thetwittermarketingblog.com/images/og.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180' }
    ]
  }
};

export default function RootLayout({ children, params }) {
    const locale = params?.locale || 'en';

    return (
      <html lang={locale} suppressHydrationWarning>
        <head>
            <GoogleAdsense />
            <GoogleAnalytics />
            <UmamiAnalytics />
        </head>
        <body className="bg-background text-foreground">
            <Providers>
                <MyNavbar locale={locale} />
                {children}
                <MyFooter locale={locale} />
            </Providers>
        </body>
      </html>
    );
  }