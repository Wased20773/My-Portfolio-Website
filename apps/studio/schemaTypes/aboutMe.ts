import {defineField, defineType} from 'sanity'

export default defineField({
  name: 'aboutMe',
  title: 'About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'File name',
      type: 'string',
      initialValue: 'about-me.md',
      readOnly: true,
    }),
    defineField({name: 'who', title: 'Who', type: 'text', rows: 3}),
    defineField({name: 'what', title: 'What', type: 'text', rows: 3}),
    defineField({name: 'when', title: 'When', type: 'text', rows: 3}),
    defineField({name: 'where', title: 'Where', type: 'text', rows: 3}),
    defineField({name: 'why', title: 'Why', type: 'text', rows: 3}),
    defineField({
      name: 'gallery',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Additional context',
      type: 'blockContent',
    }),
  ],
})
