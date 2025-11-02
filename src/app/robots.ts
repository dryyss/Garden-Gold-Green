import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gardengoldgreen.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/auth/',
          '/checkout/',
          '/profile/',
          '/orders/',
          '/cart/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

