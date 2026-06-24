import { unstable_cache } from 'next/cache'

import { getPayloadClient } from '@/lib/payload/client'

import { CACHE_TAG_ARTICLES, STATUS_OPTIONS } from './hooks/constants'

async function _getPublishedArticles() {
  const payload = await getPayloadClient()

  try {
    const { docs: articles } = await payload.find({
      collection: 'articles',
      depth: 2,
      where: {
        status: {
          equals: STATUS_OPTIONS.PUBLISHED,
        },
      },
      select: {
        slug: true,
        title: true,
        contentSummary: true,
        author: true,
        coverImage: true,
        status: true,
        readTimeInMins: true,
        publishedAt: true,
      },
      sort: '-publishedAt',
    })

    return articles ?? []
  } catch (error) {
    console.error('Failed to fetch articles', error)
    return []
  }
}

export const getPublishedArticles = unstable_cache(_getPublishedArticles, ['published-articles'], {
  tags: [CACHE_TAG_ARTICLES],
})

async function _getPublishedArticleBySlug(slug: string) {
  const payload = await getPayloadClient()

  try {
    const { docs } = await payload.find({
      collection: 'articles',
      depth: 2,
      limit: 1,
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: STATUS_OPTIONS.PUBLISHED } }],
      },
    })

    return docs[0] ?? null
  } catch (error) {
    console.error(`Failed to fetch article "${slug}"`, error)
    return null
  }
}

const getCachedPublishedArticleBySlug = unstable_cache(
  _getPublishedArticleBySlug,
  ['published-article-by-slug'],
  { tags: [CACHE_TAG_ARTICLES] },
)

export function getPublishedArticleBySlug(slug: string) {
  return getCachedPublishedArticleBySlug(slug)
}
