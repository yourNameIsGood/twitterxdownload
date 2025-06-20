export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: [
            '/'
        ],
        disallow: [
            '/api/',
            '/_next/',
        ],
        crawlDelay: 1
      },
      sitemap: 'https://www.thetwittermarketingblog.com/sitemap.xml',
    }
  }