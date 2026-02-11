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
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button text',
          type: 'internationalizedArrayString',
          validation: (Rule) =>
            Rule.custom((value: any, context: any) => {
              const hasText =
                value &&
                Array.isArray(value) &&
                value.some((item: any) => item.value && item.value.trim() !== '')

              const hasUrl = context.parent?.url && context.parent.url.trim() !== ''

              if (hasText && !hasUrl) {
                return 'Button text requires a URL'
              }

              return true
            }),
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['https'],
            }).custom((value: any, context: any) => {
              if (!value || value.trim() === '') {
                const hasText =
                  context.parent?.text &&
                  Array.isArray(context.parent.text) &&
                  context.parent.text.some((item: any) => item.value && item.value.trim() !== '')

                if (hasText) {
                  return 'Button URL is required when button text is provided'
                }

                return true // No URL and no text = OK
              }

              const hasText =
                context.parent?.text &&
                Array.isArray(context.parent.text) &&
                context.parent.text.some((item: any) => item.value && item.value.trim() !== '')

              if (!hasText) {
                return 'Button URL requires text'
              }

              return true
            }),
        },
      ],
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
