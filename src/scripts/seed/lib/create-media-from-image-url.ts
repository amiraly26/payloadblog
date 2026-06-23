import { faker } from '@faker-js/faker'
import type { Payload } from 'payload'

export async function createMediaFromImageUrl(
  payload: Payload,
  imageUrl: string,
) {
  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(
        `Image download failed: ${response.status} ${response.statusText}`,
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const mimeType =
      response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'

    const url = new URL(imageUrl)
    let filename = url.pathname.split('/').pop()

    if (!filename) {
      filename = `image-${Date.now()}.jpg`
    }

    if (!filename.includes('.')) {
      const extension = mimeType.split('/')[1] || 'jpg'
      filename = `${filename}.${extension}`
    }

    return await payload.create({
      collection: 'media',
      draft: true,
      data: {
        alt: faker.lorem.words(3),
      },
      file: {
        data: buffer,
        name: filename,
        mimetype: mimeType,
        size: buffer.length,
      },
    })
  } catch (error) {
    console.warn('Failed to seed media file:', error)
    return null
  }
}