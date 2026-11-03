import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'File name',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'extension',
      title: 'Extension',
      type: 'string',
      initialValue: 'md',
      options: {list: ['md', 'txt', 'sh'], layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Folder',
      type: 'reference',
      to: [{type: 'directory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isOngoing',
      title: 'Currently working on this project',
      type: 'boolean',
      initialValue: false,
      options: {
        layout: 'checkbox',
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'MM/YYYY',
      },
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'MM/YYYY',
      },
      hidden: ({document}) => document?.isOngoing === true,
    }),
    defineField({
      name: 'tech',
      title: 'Tech',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'links',
      title: 'Links',
      description: 'Shown separately from the description, e.g. as badges.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'projectLink',
          fields: [
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              initialValue: 'github',
              options: {
                list: [
                  {title: 'GitHub repo', value: 'github'},
                  {title: 'Live site', value: 'live'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({scheme: ['https']}),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional, e.g. "Frontend repo" when there is more than one.',
            }),
          ],
          preview: {
            select: {kind: 'kind', url: 'url', label: 'label'},
            prepare: ({kind, url, label}) => ({title: label || kind, subtitle: url}),
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'description',
      type: 'blockContent',
    }),
    // more fields for documentation purposes when a user clicks
    // on the project for more info
  ],
})
