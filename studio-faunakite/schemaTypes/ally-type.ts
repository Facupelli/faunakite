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
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      validation: (rule) => rule.required(),
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
})
