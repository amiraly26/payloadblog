import Image from 'next/image'
import Link from 'next/link'

import type { Media } from '@/payload-types'

import { ArticleMetadata } from './article-metadata'

const coverPlaceholder = 'https://via.assets.so/img.jpg?w=600&h=300&bg=6b7280&f=png'

type ArticleCardProps = {
  href: string
  title: string
  summary: string
  coverImage: Pick<Media, 'blurDataUrl' | 'url'>
  publishedAt: Date
  readTimeInMins: number
  author: {
    avatar: {
      url?: string | null
    }
    name: string
    role: string
  }
}

export function ArticleCard({
  href,
  title,
  summary,
  coverImage,
  publishedAt,
  readTimeInMins,
  author,
}: ArticleCardProps) {
  return (
    <Link href={href} aria-label={`Read article: ${title}`} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-md border border-gray-700 bg-gray-950 transition hover:border-gray-500">
        <Image
          src={coverImage.url || coverPlaceholder}
          alt={`Cover image for ${title}`}
          width={600}
          height={300}
          className="aspect-[2/1] w-full object-cover object-center"
          placeholder={coverImage.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={coverImage.blurDataUrl || undefined}
        />

        <div className="flex flex-1 flex-col p-3">
          <header>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-300">{summary}</p>
          </header>

          <div className="mt-auto">
            <ArticleMetadata intent="card" data={{ author, publishedAt, readTimeInMins }} />
          </div>
        </div>
      </article>
    </Link>
  )
}

export function ArticleCardSkeleton() {
  return <div className="h-[350px] animate-pulse rounded-md bg-gray-700" />
}
