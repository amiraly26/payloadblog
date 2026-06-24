import Image from 'next/image'
import Link from 'next/link'

import { ArticleMetadata } from './article-metadata'

type ArticleCardProps = {
  href: string
  title: string
  summary: string
  coverImage: string
  publishedAt: Date
  readTimeInMins: number
  author: {
    avatar: string
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
    <Link href={href} aria-label={`Read article: ${title}`} className="block">
      <article className="overflow-hidden rounded-md border border-gray-700 bg-gray-950 transition hover:border-gray-500">
        <Image
          src={coverImage}
          alt={`Cover image for ${title}`}
          width={600}
          height={300}
          className="max-h-[300px] w-full object-cover object-center"
        />

        <div className="p-3">
          <header>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-300">{summary}</p>
          </header>

          <ArticleMetadata intent="card" data={{ author, publishedAt, readTimeInMins }} />
        </div>
      </article>
    </Link>
  )
}

export function ArticleCardSkeleton() {
  return <div className="h-[350px] animate-pulse rounded-md bg-gray-700" />
}
