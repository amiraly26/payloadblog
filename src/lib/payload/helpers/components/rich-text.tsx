import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  LinkJSXConverter,
  RichText as PayloadRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const document = linkNode.fields.doc

  if (!document || typeof document.value !== 'object') {
    return '#'
  }

  const slug = document.value.slug

  if (typeof slug !== 'string') {
    return '#'
  }

  switch (document.relationTo) {
    case 'articles':
      return `/blog/${slug}`
    default:
      return `/${document.relationTo}/${slug}`
  }
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

export function RichText({ lexicalData }: { lexicalData: SerializedEditorState }) {
  return <PayloadRichText converters={jsxConverters} data={lexicalData} />
}
