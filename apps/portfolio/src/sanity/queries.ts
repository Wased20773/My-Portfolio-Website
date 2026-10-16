// Fields every node in the tree returns, whether folder or file.
// It's a plain JS string, pasted into the query at each level so the
// field list lives in one place.
const node = `
  _id,
  _type,
  // select() works like if/else: the first condition that's true wins.
  // Anything else (directory, aboutMe): use its "name" field as-is.
  "name": select(
    _type in ["project", "post"] => slug.current + "." + extension,
    name
  )
`;

// Sort each level alphabetically, like `ls`.
// coalesce() returns the first value that isn't null: directories and
// aboutMe have "name", projects/posts only have "slug.current".
const order = `order(coalesce(name, slug.current) asc)`;

// GROQ can't recurse, so this JS function writes the nested query text
// for us. Each call adds one "children" level, then calls itself with
// depth - 1 until it reaches 0 (the deepest level, with no "children").
function level(depth: number): string {
  if (depth === 0) return node;
  return `
    ${node},
    // Only directories get a "children" field.
    _type == "directory" => {
      // Every document whose parent points to this folder.
      // ^ means "the document one level up", i.e. the current folder.
      "children": *[parent._ref == ^._id] | ${order} {
        ${level(depth - 1)}
      }
    }
  `;
}

// The full tree, starting at ~ (documents with no parent), 5 levels deep.
// *[...] means "all documents matching this filter".
export const directoryQuery = `
*[_type in ["directory", "aboutMe", "project", "post"] && !defined(parent)] | ${order} {
  ${level(5)}
}`;

// One file's full contents, fetched when it's opened (like `cat`).
// $id is a parameter passed at fetch time: client.fetch(fileQuery, { id })
// [0] returns the single document instead of an array of one.
export const fileQuery = `
*[_id == $id][0]{
  _id,
  _type,
  _type == "aboutMe" => {
    who, what, when, where, why, body,
    "gallery": gallery[]{ alt, "url": asset->url }
  },
  _type == "project" => {
    title, isOngoing, startDate, endDate, tech, description
  },
  _type == "post" => {
    title, publishedAt, shortDescription, body,
    "coverImage": coverImage.asset->url
  }
}`;
