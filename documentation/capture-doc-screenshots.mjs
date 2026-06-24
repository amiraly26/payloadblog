import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

async function capture(url, filename, waitFor) {
  await page.goto(url, { waitUntil: 'networkidle' })
  if (waitFor) await page.locator(waitFor).first().waitFor({ timeout: 30_000 })
  await page.screenshot({ path: `documentation/screenshots/${filename}`, fullPage: true })
}

await capture('http://localhost:3000/blog', '01-blog-list.png', 'article')

const firstArticleHref = await page.locator('a[aria-label^="Read article:"]').first().getAttribute('href')
if (!firstArticleHref) throw new Error('No published article link was found')
await capture(`http://localhost:3000${firstArticleHref}`, '02-article-page.png', 'article')

await capture(
  'http://localhost:3000/admin/collections/articles',
  '03-articles-admin.png',
  'body',
)
await capture('http://localhost:3000/admin/collections/media', '04-media-admin.png', 'body')

await browser.close()
