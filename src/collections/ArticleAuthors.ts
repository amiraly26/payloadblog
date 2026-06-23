import type { CollectionConfig } from 'payload'

export const ArticleAuthors: CollectionConfig = {
  slug: 'article-authors',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['Staff Writer', 'Guest Writer', 'Flo Rida', 'Contributor', 'Editor'],
      defaultValue: 'Staff Writer',
      required: true,
    },
  ],
}
