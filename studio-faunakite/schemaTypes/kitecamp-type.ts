import {defineField, defineType} from 'sanity'

export const kitecampType = defineType({
  name: 'kitecamp',
  title: 'Kitecamp',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare({title, date, media}) {
      const titleText =
        title?.find((t: any) => t._key === 'es')?.value ||
        title?.find((t: any) => t._key === 'en')?.value ||
        'Sin título'
      return {
        title: titleText,
        subtitle: date,
        media,
      }
    },
  },
})
