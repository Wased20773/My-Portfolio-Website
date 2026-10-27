// Where terminal cmd output lives

import { Fragment, type ElementType, type ReactNode } from "react";
import type { Block, Directory, FileNode, Output, Project } from "@/data/type";

export default function RightPanel({ output }: { output: Output }) {
  if (!output) return null;

  switch (output.kind) {
    case "error":
      return <p className="font-mono text-red-700">{output.message}</p>;
    case "ls":
      return <Listing dir={output.dir} />;
    case "file":
      return <FileView file={output.file} />;
  }
}

// ---------- ls ----------

function Listing({ dir }: { dir: Directory }) {
  return (
    <ul className="flex gap-5 flex-wrap font-mono">
      {dir.files.map((f) => (
        <li
          key={f._id}
          className="text-gray-800 rounded-md bg-gray-400 px-2 py-1"
        >
          {f.name}
        </li>
      ))}
    </ul>
  );
}

// ---------- cat ----------

function FileView({ file }: { file: FileNode }) {
  switch (file._type) {
    case "aboutMe":
      return (
        <article>
          <h2>{file.name}</h2>
          <dl>
            {(["who", "what", "when", "where", "why"] as const).map(
              (key) =>
                file[key] && (
                  <div key={key}>
                    <dt className="font-semibold capitalize">{key}</dt>
                    <dd>{file[key]}</dd>
                  </div>
                ),
            )}
          </dl>
          <RichText blocks={file.body} />
        </article>
      );

    case "project":
      return (
        <article>
          <h2 className="text-stone-800">{file.title}</h2>
          <p className="opacity-75 text-stone-500">{projectDates(file)}</p>
          {file.tech && (
            <ul className="flex flex-wrap gap-2 mb-5" aria-label="Tech stack">
              {file.tech.map((t) => (
                <li
                  key={t}
                  className="bg-stone-800 text-stone-300 rounded-full px-3"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
          <RichText blocks={file.description} />
        </article>
      );

    case "post":
      return (
        <article>
          <h2>{file.title}</h2>
          {file.publishedAt && (
            <time dateTime={file.publishedAt} className="opacity-75">
              {formatDate(file.publishedAt, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          {file.shortDescription && (
            <p className="italic">{file.shortDescription}</p>
          )}
          <RichText blocks={file.body} />
        </article>
      );
  }
}

// ---------- Dates ----------

// timeZone UTC: "2026-06-01" is stored as UTC, so without it US time zones show May 31
function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    ...options,
    timeZone: "UTC",
  });
}

function projectDates(project: Project) {
  const short = { month: "short", year: "numeric" } as const;
  const start = project.startDate ? formatDate(project.startDate, short) : "?";
  const end = project.isOngoing
    ? "Present"
    : project.endDate
      ? formatDate(project.endDate, short)
      : "?";
  return `${start} – ${end}`;
}

// ---------- Portable Text ----------

function RichText({ blocks }: { blocks: Block[] | null }) {
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
    <div className="whitespace-pre-line flex flex-col gap-2 text-stone-800">
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
