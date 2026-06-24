import Link from 'next/link'

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/blog"
        aria-label="Back to blog"
        className="relative mb-8 inline-flex items-center gap-2 no-underline after:absolute after:right-0 after:bottom-1 after:left-1 after:h-0.5 after:bg-gray-600 after:content-[''] after:hidden hover:after:block"
      >
        <ArrowLeftIcon />
        All articles
      </Link>

      {children}
    </div>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
