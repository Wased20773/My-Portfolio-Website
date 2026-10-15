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
      name: 'description',
      title: 'description',
      type: 'blockContent',
    }),
    // more fields for documentation purposes when a user clicks
    // on the project for more info
  ],
})
