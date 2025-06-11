export const metadata = {
    description: 'Download TwitterX videos and images',
    keywords: ['twitterx', 'download', 'video', 'image'],
    authors: [{ name: 'TwitterXDownload' }],
    creator: 'TwitterXDownload',
    publisher: 'TwitterXDownload',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://your-domain.com',
      siteName: 'My Website',
      title: 'My Website',
      description: 'Welcome to my website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'My Website',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My Website',
      description: 'Welcome to my website',
      images: ['/twitter-image.jpg'],
      creator: '@yourusername',
    }
  };
  
  export default function RootLayout({ children }) {
    return children;
  }