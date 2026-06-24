const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { createRequire } = require('node:module')

const toolRequire = createRequire(path.join(os.tmpdir(), 'codex-docx-tool', 'package.json'))
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = toolRequire('docx')

const outputPath = path.resolve('documentation/Payload-Blog-Issues-and-Solutions.docx')
const screenshots = path.resolve('documentation/screenshots')

const issues = [
  {
    title: 'Localhost refused to connect',
    problem: 'Chrome displayed ERR_CONNECTION_REFUSED when opening localhost:3000.',
    cause: 'The Next.js development server was not running or had been stopped.',
    solution: 'Open PowerShell in the project folder and run npm run dev. Keep that terminal open while using the site.',
  },
  {
    title: 'Incorrect terminal commands (nr and pnpm)',
    problem: 'PowerShell reported that nr or pnpm was not recognized.',
    cause: 'The tutorial author used terminal aliases and pnpm, but this Windows project uses npm.',
    solution: 'Use npm run seed instead of nr seed, npm run dev instead of nr dev, and npm install <package> instead of pnpm add <package>.',
  },
  {
    title: 'Duplicate admin email during seeding',
    problem: 'The seed command failed because admin@example.com was already registered.',
    cause: 'The seed script tried to create the same unique user every time it ran.',
    solution: 'A Payload error checker was added. Duplicate email errors now produce “Admin user already exists” and do not crash the seed process.',
  },
  {
    title: 'User ID did not return to 1 automatically',
    problem: 'After deleting a user, the next database ID remained 2.',
    cause: 'PostgreSQL sequences do not normally reuse deleted IDs. This protects relationships and database consistency.',
    solution: 'The record was corrected during setup, but the important lesson is that gaps in IDs are normal and should usually be left alone.',
  },
  {
    title: 'TypeScript baseUrl deprecation warning',
    problem: 'VS Code warned that compiler option baseUrl is deprecated for a future TypeScript version.',
    cause: 'The project did not need baseUrl because the @/* alias already had a direct paths mapping.',
    solution: 'The unnecessary baseUrl option was removed while keeping the @/* import alias working.',
  },
  {
    title: 'Invalid or missing environment variables',
    problem: 'The app could fail when the seed email or password was missing or invalid.',
    cause: 'Environment values were previously read directly without validation.',
    solution: 'Zod and @t3-oss/env-nextjs now validate CMS_SEED_ADMIN_EMAIL and CMS_SEED_ADMIN_PASSWORD before they are used.',
  },
  {
    title: 'Environment values were hard-coded in the seed file',
    problem: 'Admin credentials were originally written directly inside TypeScript code.',
    cause: 'The early tutorial step used temporary example values.',
    solution: 'Credentials were moved into .env, example keys were added to .env.example, and the seed/config code now uses the validated env object.',
  },
  {
    title: 'Article slug had to be entered manually',
    problem: 'Creating an article required typing both a title and a URL-friendly slug.',
    cause: 'There was no field hook to generate the slug.',
    solution: 'A beforeValidate hook now converts the title into a lowercase hyphenated slug automatically while preserving an explicitly entered slug.',
  },
  {
    title: 'Article summary was manual',
    problem: 'Content Summary had to be copied from the article body.',
    cause: 'Payload rich text is stored as Lexical JSON rather than plain text.',
    solution: 'A hook converts Lexical content to plain text and creates a summary of about 160 characters. A manually written summary is still respected.',
  },
  {
    title: 'Reading time was not calculated',
    problem: 'Read Time In Mins showed zero or required manual input.',
    cause: 'No calculation existed for the rich-text content.',
    solution: 'An afterRead hook converts the content to text, counts words, and calculates at least one minute using 200 words per minute.',
  },
  {
    title: 'Authors appeared as numbers (1 and 2)',
    problem: 'The Article Author relationship dropdown initially showed database IDs.',
    cause: 'Payload did not know which Article Author field should be used as the display title.',
    solution: 'admin.useAsTitle was set to name in the Article Authors collection. Payload now displays author names while still storing relationship IDs.',
  },
  {
    title: 'Article author needed an avatar image',
    problem: 'Seeded authors could not be created because avatar is a required Media relationship.',
    cause: 'A remote Faker image URL is not itself a Payload Media record.',
    solution: 'A helper downloads the image, converts it to a Buffer, creates a Media record, and then assigns the new Media ID to the author avatar.',
  },
  {
    title: 'Media needed a fast loading placeholder',
    problem: 'Large images could leave an empty area while loading.',
    cause: 'The Media collection did not store a small preview.',
    solution: 'A Media hook creates a Base64 blurDataUrl. Next Image now uses it as a blur placeholder on both article cards and article pages.',
  },
  {
    title: 'Not every database article appeared on /blog',
    problem: 'The database contained more articles than the public blog displayed.',
    cause: 'The public query intentionally returns only records whose status is Published. Draft articles remain private.',
    solution: 'This was confirmed as correct. To display an article, set Status to Published, provide Published At, and save it in Payload Admin.',
  },
  {
    title: 'Article cover images had different heights',
    problem: 'Portrait and landscape uploads made the cards uneven.',
    cause: 'A max-height rule allowed each image to keep a different rendered height.',
    solution: 'Every cover now uses the same 2:1 frame with object-cover. Cards use flex layout so their metadata aligns at the bottom.',
  },
  {
    title: 'Frontend contained hard-coded example content',
    problem: 'The blog initially showed John Doe, placeholder pictures, and Lorem Ipsum from the source code.',
    cause: 'The frontend was built before it was connected to Payload.',
    solution: 'Payload fetchers now load published articles, populated authors, avatars, cover images, dates, summaries, and reading times from PostgreSQL.',
  },
  {
    title: 'Individual article page was hard-coded',
    problem: 'Every /blog/[slug] route displayed the same sample article.',
    cause: 'There was no query for a single published article by slug.',
    solution: 'A cached getPublishedArticleBySlug function was added. The route now loads the matching published record or returns a 404.',
  },
  {
    title: 'Payload rich text did not render on the website',
    problem: 'Article content is Lexical JSON and cannot be displayed as a normal string.',
    cause: 'The frontend needed Payload’s Lexical-to-React converter.',
    solution: 'A reusable RichText component now renders Lexical content and translates internal article links into /blog/[slug] URLs.',
  },
  {
    title: 'Relationship fields could be an ID or an object',
    problem: 'TypeScript warned when the UI tried to use coverImage.url, author.name, or author.avatar.url.',
    cause: 'Payload relationships are typed as either a numeric ID or a populated object.',
    solution: 'A reusable relationIsObject type guard checks populated relationships before rendering them.',
  },
  {
    title: 'Published article query could repeat unnecessarily',
    problem: 'The same article list query could run repeatedly.',
    cause: 'No Next.js data cache was configured.',
    solution: 'unstable_cache now caches the published article list and individual slug queries using the articles cache tag.',
  },
  {
    title: 'Cached data could become stale after editing an article',
    problem: 'A newly published or edited article might not appear immediately.',
    cause: 'Caching requires explicit invalidation when CMS data changes.',
    solution: 'Payload afterChange and afterDelete hooks call revalidateTag using the Next.js 16 API, immediately refreshing article data.',
  },
  {
    title: 'Tailwind styles were not available',
    problem: 'The frontend started as plain unstyled “Hello world” output.',
    cause: 'Tailwind CSS and its PostCSS integration had not been configured.',
    solution: 'Tailwind CSS, @tailwindcss/postcss, PostCSS, and the typography plugin were installed and connected through globals.css.',
  },
  {
    title: 'npm audit reported dependency vulnerabilities',
    problem: 'npm displayed moderate, high, and critical vulnerability counts after installation.',
    cause: 'Some installed packages had advisories in their dependency tree.',
    solution: 'The warning was documented instead of blindly running npm audit fix --force, which can introduce breaking changes. Dependencies should be reviewed and upgraded deliberately.',
  },
]

const children = []
const addText = (text, options = {}) =>
  children.push(new Paragraph({ children: [new TextRun({ text, ...options })], spacing: { after: 120 } }))

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    heading: HeadingLevel.TITLE,
    children: [new TextRun({ text: 'Payload Blog Project', bold: true, size: 40 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Issues, Causes, and Solutions', bold: true, size: 30 })],
    spacing: { after: 220 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Next.js + Payload CMS + PostgreSQL + Tailwind CSS', italics: true })],
    spacing: { after: 300 },
  }),
)

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '1. Project overview' }))
addText('This project is a full-stack blog. Payload CMS provides the admin panel and content API, PostgreSQL stores the data, Next.js renders the public pages, and Tailwind CSS styles the frontend.')
addText('The finished system supports users, media, article authors, draft and published articles, generated slugs, automatic summaries, calculated reading time, image blur placeholders, cached queries, cache invalidation, and dynamic article pages.')

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '2. Final working blog' }))
children.push(
  new Paragraph({
    children: [
      new ImageRun({
        data: fs.readFileSync(path.join(screenshots, '01-blog-list.png')),
        transformation: { width: 620, height: 431 },
        type: 'png',
      }),
    ],
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Figure 1. Live /blog page captured from this project.', italics: true })],
  }),
)

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '3. Quick issue reference' }))
children.push(
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: ['Issue', 'Main cause', 'Solution'].map(
          (text) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
              width: { size: 33, type: WidthType.PERCENTAGE },
            }),
        ),
      }),
      ...issues.map(
        (issue) =>
          new TableRow({
            children: [issue.title, issue.cause, issue.solution].map(
              (text) => new TableCell({ children: [new Paragraph({ text })] }),
            ),
          }),
      ),
    ],
  }),
)

children.push(new Paragraph({ children: [new PageBreak()] }))
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '4. Detailed issue log' }))
issues.forEach((issue, index) => {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, text: `4.${index + 1} ${issue.title}` }))
  children.push(
    new Paragraph({ children: [new TextRun({ text: 'Problem: ', bold: true }), new TextRun(issue.problem)] }),
    new Paragraph({ children: [new TextRun({ text: 'Cause: ', bold: true }), new TextRun(issue.cause)] }),
    new Paragraph({
      children: [new TextRun({ text: 'Solution: ', bold: true }), new TextRun(issue.solution)],
      spacing: { after: 180 },
    }),
  )
})

children.push(new Paragraph({ children: [new PageBreak()] }))
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '5. Evidence from the finished project' }))

const evidence = [
  ['02-article-page.png', 'Figure 2. A real published article loaded from Payload by its slug.', 620, 600],
  ['03-articles-admin.png', 'Figure 3. The project’s Payload Articles collection.', 620, 431],
  ['04-media-admin.png', 'Figure 4. The project’s Media collection with generated blur data URLs.', 620, 431],
]

for (const [filename, caption, width, height] of evidence) {
  children.push(
    new Paragraph({
      children: [
        new ImageRun({
          data: fs.readFileSync(path.join(screenshots, filename)),
          transformation: { width, height },
          type: 'png',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true })],
      spacing: { after: 260 },
    }),
  )
}

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '6. Useful commands' }))
const commands = [
  ['Start the application', 'npm run dev'],
  ['Run seed scripts', 'npm run seed'],
  ['Check TypeScript', 'npx tsc --noEmit'],
  ['Open the public blog', 'http://localhost:3000/blog'],
  ['Open Payload Admin', 'http://localhost:3000/admin'],
]
commands.forEach(([label, command]) => {
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun({ text: command, font: 'Consolas' }),
      ],
    }),
  )
})

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: '7. Current status' }))
addText('The project is working end-to-end. Published articles appear on /blog, draft articles remain private, individual pages load by slug, rich text is rendered, cover images and avatars come from Payload Media, blur placeholders are active, and article caches are invalidated after CMS changes.')
addText('The application was verified with TypeScript checks and HTTP 200 responses for the article list and individual article routes.')

const document = new Document({
  styles: {
    default: {
      document: { run: { font: 'Aptos', size: 22 } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    },
  ],
})

Packer.toBuffer(document).then((buffer) => {
  fs.writeFileSync(outputPath, buffer)
  console.log(outputPath)
})
