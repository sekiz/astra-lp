import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/tr`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
          tr: `${baseUrl}/tr/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
          tr: `${baseUrl}/tr/privacy`,
        },
      },
    },
  ]
}
