import Image from 'next/image'

type ArticleMetadataProps = {
  intent: 'card' | 'post'
  className?: string
  data: {
    author: {
      avatar: string
      name: string
      role: string
    }
    publishedAt: Date
    readTimeInMins: number
  }
}

export function ArticleMetadata({ data, intent, className }: ArticleMetadataProps) {
  const { author, publishedAt, readTimeInMins } = data

  return (
    <div className={`mt-4 flex items-center justify-between ${className ?? ''}`}>
      <div className={`flex min-w-0 items-center ${intent === 'card' ? 'gap-2' : 'gap-3'}`}>
        <Image
          src={author.avatar}
          alt={`${author.name}'s avatar`}
          width={40}
          height={40}
          sizes="40px"
          className={`shrink-0 rounded-full object-cover ${
            intent === 'card' ? 'size-10' : 'size-11'
          }`}
        />
        <div
          className={`flex min-w-0 flex-col leading-none ${
            intent === 'card' ? 'gap-1.5 text-sm' : 'gap-2 text-base'
          }`}
        >
          <p className="truncate font-semibold text-gray-100">{author.name}</p>
          <p className="truncate text-dimmed">{author.role}</p>
        </div>
      </div>

      <div
        className={`flex shrink-0 flex-col text-right ${
          intent === 'card' ? 'gap-1.5 text-sm' : 'gap-2 text-base'
        }`}
      >
        <time dateTime={new Date(publishedAt).toISOString()} className="leading-none">
          {publishedAt.toLocaleString('en-GB', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
        <p className="text-dimmed leading-none">{readTimeInMins} minutes read</p>
      </div>
    </div>
  )
}
