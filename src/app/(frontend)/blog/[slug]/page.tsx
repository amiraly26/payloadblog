import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { getPublishedArticleBySlug } from '@/collections/Articles/fetchers'
import { RichText } from '@/lib/payload/helpers/components/rich-text'
import { relationIsObject } from '@/lib/payload/helpers/relation-is-object'

import { ArticleMetadata } from '../_components/article-metadata'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)

  if (!article) notFound()
  if (!relationIsObject(article.coverImage)) notFound()
  if (!relationIsObject(article.author) || !relationIsObject(article.author.avatar)) notFound()

  return (
    <article className="prose prose-invert lg:prose-lg">
      <h1>{article.title}</h1>

      <ArticleMetadata
        intent="post"
        data={{
          author: {
            avatar: article.author.avatar,
            name: article.author.name,
            role: article.author.role,
          },
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          readTimeInMins: article.readTimeInMins ?? 0,
        }}
        className="not-prose"
      />

      <Image
        src={article.coverImage.url ?? ''}
        alt={article.coverImage.alt || `Cover image for ${article.title}`}
        width={article.coverImage.width ?? 600}
        height={article.coverImage.height ?? 300}
        className="aspect-[2/1] w-full rounded-md object-cover object-center"
        placeholder={article.coverImage.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={article.coverImage.blurDataUrl || undefined}
      />

      <RichText lexicalData={article.content as unknown as SerializedEditorState} />
    </article>
  )
}
