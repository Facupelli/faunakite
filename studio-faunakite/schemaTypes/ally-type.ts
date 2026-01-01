import {defineField, defineType} from 'sanity'

export const allyType = defineType({
  name: 'ally',
  title: 'Aliado',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Hospedaje', value: 'lodging'},
          {title: 'Restaurante', value: 'restaurant'},
          {title: 'Otros', value: 'other'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'phone',
      type: 'string',
    }),
    defineField({
      name: 'link',
      type: 'string',
    }),
    defineField({
      name: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({title, media}) {
      // Show Spanish title in preview, fallback to English
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
