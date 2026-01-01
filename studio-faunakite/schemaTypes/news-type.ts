import {defineField, defineType} from 'sanity'

export const newsType = defineType({
  name: 'news',
  title: 'Noticia',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'slug',
      type: 'internationalizedArraySlug',
    }),
    defineField({
      name: 'summary',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'epigraph',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'body',
      type: 'internationalizedArrayBlockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({title, media}) {
      const titleText =
        title?.find((t: any) => t._key === 'es')?.value ||
        title?.find((t: any) => t._key === 'en')?.value ||
        'Sin título'
      return {
        title: titleText,
        media,
      }
    },
  },
})
