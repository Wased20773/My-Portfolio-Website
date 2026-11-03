// Matches apps/studio/sanity.cli.ts
const projectId = "em6qokzp";
const dataset = "production";

// Sanity image refs look like "image-<id>-<width>x<height>-<ext>".
// Turns one into its CDN url plus its size (so the page doesn't jump while it loads).
export function sanityImage(ref: string) {
  const [, id, size, ext] = ref.split("-");
  const [width, height] = size.split("x").map(Number);

  return {
    src: `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${size}.${ext}`,
    width,
    height,
  };
}
