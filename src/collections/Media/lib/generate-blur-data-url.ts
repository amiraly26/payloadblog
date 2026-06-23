import type { Buffer } from 'node:buffer'
import { getPlaiceholder } from 'plaiceholder'

export function isEligibleForBlurDataURL(mime?: null | string): boolean {
  if (!mime?.startsWith('image/')) return false
  if (mime === 'image/svg+xml') return false
  return true
}

export async function generateBlurDataUrl(
  buffer?: Buffer<ArrayBufferLike>,
): Promise<null | string> {
  if (!buffer) {
    console.warn('Failed to generate blur data URL: missing buffer')
    return null
  }

  const { base64 } = await getPlaiceholder(buffer)
  return base64
}
