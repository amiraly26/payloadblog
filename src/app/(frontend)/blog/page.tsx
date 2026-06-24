import { getPublishedArticles } from '@/collections/Articles/fetchers'
import { relationIsObject } from '@/lib/payload/helpers/relation-is-object'

import { ArticleCard } from './_components/article-card'

export default async function BlogIndexPage() {
  const articles = await getPublishedArticles()

  if (!articles.length) {
    return <p>No articles found</p>
  }

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      {articles.map(
        ({ id, title, slug, contentSummary, coverImage, readTimeInMins, publishedAt, author }) => {
          if (!relationIsObject(coverImage)) return null
          if (!relationIsObject(author) || !relationIsObject(author.avatar)) return null

          return (
            <ArticleCard
              key={id}
              href={`/blog/${slug}`}
              title={title}
              summary={contentSummary}
              coverImage={coverImage}
              publishedAt={publishedAt ? new Date(publishedAt) : new Date()}
              readTimeInMins={readTimeInMins ?? 0}
              author={{
                avatar: author.avatar,
                name: author.name,
                role: author.role,
              }}
            />
          )
        },
      )}
    </div>
  )
}
