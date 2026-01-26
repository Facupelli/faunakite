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
      name: 'whatsappLink',
      title: 'WhatsApp Link',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
          allowRelative: false,
        }),
    }),
    defineField({
      name: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'discount',
      title: 'Descuento',
      type: 'object',
      fields: [
        {
          name: 'value',
          title: 'Valor',
          type: 'string',
          description: 'Ej: "10%", "15%", "2x1"',
          validation: (rule) => rule.required(),
        },
        {
          name: 'details',
          title: 'Detalles adicionales',
          type: 'internationalizedArrayString',
          description: 'Opcional: condiciones, restricciones, etc.',
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
