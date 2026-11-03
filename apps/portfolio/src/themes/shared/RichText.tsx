// Renders Sanity Portable Text. Shared by every structure; colors come from tokens.

import { Fragment, type ElementType, type ReactNode } from "react";
import type { Block, ContentBlock } from "@/data/type";
import { sanityImage } from "@/lib/sanityImage";

export default function RichText({ blocks }: { blocks: ContentBlock[] | null }) {
  if (!blocks) return null;

  const out: ReactNode[] = [];
  let bullets: Block[] = [];

  // Consecutive bullet blocks become one (nested) <ul>
  const flushBullets = () => {
    if (!bullets.length) return;
    out.push(<BulletList key={bullets[0]._key} items={bullets} level={1} />);
    bullets = [];
  };

  for (const block of blocks) {
    if (block._type === "image") {
      flushBullets();
      const { src, width, height } = sanityImage(block.asset._ref);
      out.push(
        // eslint-disable-next-line @next/next/no-img-element -- plain CDN image, no next/image config needed
        <img
          key={block._key}
          src={src}
          width={width}
          height={height}
          alt={block.alt ?? ""}
          loading="lazy"
          className="max-w-full h-auto rounded-md"
        />,
      );
      continue;
    }

    // Unknown block type from the CMS: skip it instead of crashing
    if (block._type !== "block") continue;

    if (block.listItem) {
      bullets.push(block);
      continue;
    }
    flushBullets();
    const Tag: ElementType = block.style === "normal" ? "p" : block.style;
    out.push(
      <Tag key={block._key}>
        <Spans block={block} />
      </Tag>,
    );
  }
  flushBullets();

  // pre-line keeps the "\n\n" line breaks inside your text
  return (
    <div className="whitespace-pre-line flex flex-col gap-2 text-ink">
      {out}
    </div>
  );
}

// Each bullet takes the deeper-level bullets after it as its own sub-list:
// level 1, level 2, level 2, level 1  →  <li>…<ul><li/><li/></ul></li><li/>
function BulletList({ items, level }: { items: Block[]; level: number }) {
  const lis: ReactNode[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const children: Block[] = [];
    while (i + 1 < items.length && (items[i + 1].level ?? 1) > level) {
      children.push(items[++i]);
    }

    lis.push(
      <li key={item._key}>
        <Spans block={item} />
        {children.length > 0 && (
          <BulletList items={children} level={level + 1} />
        )}
      </li>,
    );
  }

  // disc → circle → square, like most editors
  const marker = ["list-disc", "list-[circle]", "list-[square]"][(level - 1) % 3];
  return <ul className={`${marker} pl-5`}>{lis}</ul>;
}

function Spans({ block }: { block: Block }) {
  return block.children.map((span) => {
    let node: ReactNode = span.text;
    for (const mark of span.marks) {
      if (mark === "strong") node = <strong>{node}</strong>;
      else if (mark === "em") node = <em>{node}</em>;
      else {
        const link = block.markDefs.find((d) => d._key === mark);
        if (link) {
          node = (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {node}
            </a>
          );
        }
      }
    }
    return <Fragment key={span._key}>{node}</Fragment>;
  });
}
