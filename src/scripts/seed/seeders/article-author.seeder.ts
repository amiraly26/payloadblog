import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

import { ARTICLE_AUTHOR_ROLE_OPTIONS } from '@/collections/ArticleAuthors/constants'

import { createMediaFromImageUrl } from '../lib/create-media-from-image-url'

const SEEDED_AUTHOR_NAME = 'Kariane Schowalter Sr.'
const SEEDED_AUTHOR_IMAGE =
  'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/1.jpg'

export async function seedArticleAuthor(payload: Payload) {
  const existingAuthors = await payload.find({
    collection: 'article-authors',
    where: { name: { equals: SEEDED_AUTHOR_NAME } },
    limit: 1,
  })

  if (existingAuthors.docs.length > 0) {
    console.log('Article author already exists')
    return existingAuthors.docs[0]
  }

  faker.seed(20260623)
  const image = await createMediaFromImageUrl(payload, SEEDED_AUTHOR_IMAGE)

  if (!image) {
    console.warn('Stopped seeding article author because no image was created')
    return
  }

  const author = await payload.create({
    collection: 'article-authors',
    data: {
      name: SEEDED_AUTHOR_NAME,
      role: ARTICLE_AUTHOR_ROLE_OPTIONS.STAFF_WRITER,
      avatar: image.id,
    },
  })

  console.log('Article author created:', author)
  return author
}
