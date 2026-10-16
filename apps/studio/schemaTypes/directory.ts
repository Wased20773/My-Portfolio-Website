import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'directory',
  title: 'Directory',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Folder name',
      type: 'string',
      description: 'Shown as "name/" in the terminal. Lowercase, numbers, dashes',
      validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/, {name: 'folder name'}),
    }),
    defineField({
      name: 'parent',
      title: 'Parent folder',
      type: 'reference',
      to: [{type: 'directory'}],
      description: 'Leave empty to place this folder in ~ ($HOME).',
      options: {
        // Prevent picking itself as its own parent
        filter: ({document}) => ({
          filter: '_id != $id',
          params: {id: document._id.replace(/^drafts\./, '')},
        }),
      },
    }),
  ],
  preview: {
    select: {name: 'name', parent: 'parent.name'},
    prepare: ({name, parent}) => ({
      title: `${name}/`,
      subtitle: parent ? `~/${parent}/` : `~/`,
    }),
  },
})
