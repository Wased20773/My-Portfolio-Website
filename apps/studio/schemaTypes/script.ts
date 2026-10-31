import {defineField, defineType} from 'sanity'

// Only places a runnable script in a folder so `ls` can show it.
// What the script asks and does lives in the portfolio (src/lib/scripts.ts).
export default defineType({
  name: 'script',
  title: 'Script',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'File name',
      type: 'string',
      description: 'e.g. "contact.sh". Must match a script defined in the portfolio code.',
      validation: (rule) => rule.required().regex(/^[a-z0-9-]+\.sh$/, {name: 'script name'}),
    }),
    defineField({
      name: 'parent',
      title: 'Folder',
      type: 'reference',
      to: [{type: 'directory'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {name: 'name', parent: 'parent.name'},
    prepare: ({name, parent}) => ({
      title: name,
      subtitle: parent ? `~/${parent}/` : `~/`,
    }),
  },
})
