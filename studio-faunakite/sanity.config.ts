import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {projectId, dataset} from './environment'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

export default defineConfig({
  name: 'default',
  title: 'FaunaKite',

  projectId,
  dataset,

  plugins: [
    internationalizedArray({
      languages: [
        {id: 'es', title: 'Español'},
        {id: 'en', title: 'English'},
      ],
      defaultLanguages: ['es'],
      fieldTypes: [
        'string',
        'text',
        'slug',
        defineField({
          name: 'blockContent',
          type: 'array',
          of: [{type: 'block'}],
        }),
      ],
    }),
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
