import { faker } from '@faker-js/faker'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'
import { slugify } from 'payload/shared'

import { MAX_SUMMARY_LENGTH, STATUS_OPTIONS } from '@/collections/Articles/hooks/constants'
import config from '@payload-config'

import { createMediaFromImageUrl } from '../lib/create-media-from-image-url'

const ARTICLES_COUNT = 5

export async function seedArticles(payload: Payload) {
  const authors = await payload.find({ collection: 'article-authors', limit: 1 })
  const author = authors.docs[0]

  if (!author) {
    console.warn('Stopped seeding articles because no article author exists')
    return
  }

  faker.seed(20260624)
  let successCount = 0

  for (let index = 0; index < ARTICLES_COUNT; index++) {
    try {
      const title = faker.lorem.sentence()
      const existing = await payload.find({
        collection: 'articles',
        where: { title: { equals: title } },
        limit: 1,
      })

      if (existing.docs.length > 0) continue

      const imageUrl = faker.image.urlPicsumPhotos()
      const image = await createMediaFromImageUrl(payload, imageUrl)
      if (!image) continue

      const content = faker.lorem.paragraphs(3)
      const contentLexical = convertMarkdownToLexical({
        markdown: content,
        editorConfig: await editorConfigFactory.default({ config: await config }),
      })
      const status = faker.helpers.arrayElement(Object.values(STATUS_OPTIONS))

      await payload.create({
        collection: 'articles',
        draft: true,
        data: {
          title,
          slug: slugify(title) || faker.string.uuid(),
          content: contentLexical,
          contentSummary: content.slice(0, MAX_SUMMARY_LENGTH),
          author: author.id,
          coverImage: image.id,
          status,
          publishedAt: faker.date.recent().toISOString(),
        },
      })

      successCount++
    } catch (error) {
      console.error('Failed to seed article:', error)
    }
  }

  console.log(`${successCount} article(s) seeded successfully`)
}
