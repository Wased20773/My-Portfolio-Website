// Renders Sanity Portable Text. Shared by every structure; colors come from tokens.

import { Fragment, type ElementType, type ReactNode } from "react";
import type { Block } from "@/data/type";

export default function RichText({ blocks }: { blocks: Block[] | null }) {
  if (!blocks) return null;

  const out: ReactNode[] = [];
  let bullets: Block[] = [];

  // Consecutive bullet blocks become one <ul>
  const flushBullets = () => {
    if (!bullets.length) return;
    out.push(
      <ul key={bullets[0]._key} className="list-disc pl-5">
        {bullets.map((b) => (
          <li key={b._key}>
            <Spans block={b} />
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const block of blocks) {
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
