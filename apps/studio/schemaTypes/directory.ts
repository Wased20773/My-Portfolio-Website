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
      description:
        'Shown as "name/" in the terminal. Lowercase, numbers, dashes. Use "~" for the root folder.',
      // Either exactly "~" (the root) or a normal folder name
      validation: (rule) => rule.required().regex(/^(~|[a-z0-9-]+)$/, {name: 'folder name'}),
    }),
    defineField({
      name: 'parent',
      title: 'Parent folder',
      type: 'reference',
      to: [{type: 'directory'}],
      description: 'Pick ~ for a top-level folder. Only ~ itself has no parent.',
      // The root can't live inside another folder, or every path breaks
      validation: (rule) =>
        rule.custom((parent, {document}) =>
          document?.name === '~' && parent ? 'The root folder (~) can’t have a parent' : true,
        ),
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
