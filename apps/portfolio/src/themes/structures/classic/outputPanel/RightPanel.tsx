// Where terminal cmd output lives

import { formatDate, projectDates } from "@/lib/dates";
import RichText from "@/themes/shared/RichText";
import type { Directory, FileNode, Output } from "@/data/type";

export default function RightPanel({ output }: { output: Output }) {
  if (!output) return null;

  switch (output.kind) {
    case "error":
      return <p className="font-mono text-danger">{output.message}</p>;
    case "ls":
      return <Listing dir={output.dir} />;
    case "file":
      return <FileView file={output.file} />;
  }
}

// ---------- ls ----------

function Listing({ dir }: { dir: Directory }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
      {dir.files.map((f, i) =>
        f._type === "aboutMe" ? (
          <li
            key={f._id}
            // --i: CSS Variable
            style={{ "--i": i } as React.CSSProperties}
            className="motion-safe:animate-slide-in-left motion-safe:[animation-delay:calc(var(--i)*var(--stagger))] text-card-ink rounded-md bg-card px-2 py-1"
          >
            <p className="font-semibold">{f.name}</p>
          </li>
        ) : f._type === "project" ? (
          <li
            key={f._id}
            // --i: CSS Variable
            style={{ "--i": i } as React.CSSProperties}
            className="motion-safe:animate-slide-in-left motion-safe:[animation-delay:calc(var(--i)*var(--stagger))] flex flex-col justify-between text-card-ink rounded-md bg-card px-2 py-1"
          >
            <p className="font-semibold">{f.name}</p>
            {/* {f.tech && (
              <ul className="flex flex-wrap gap-2" aria-label="Tech stack"></ul>
            )} */}
            <p className="text-card-muted">{projectDates(f)}</p>
          </li>
        ) : f._type === "post" ? (
          <li
            key={f._id} // --i: CSS Variable
            style={{ "--i": i } as React.CSSProperties}
            className="motion-safe:animate-slide-in-left motion-safe:[animation-delay:calc(var(--i)*var(--stagger))] rounded-2xl bg-card-alt p-3"
          >
            <p className="font-semibold text-card-alt-ink">{f.name}</p>
            {f.publishedAt && (
              <time dateTime={f.publishedAt} className="text-card-alt-faint">
                {formatDate(f.publishedAt, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
            <p className="text-card-alt-muted line-clamp-5 mt-5">
              {f.shortDescription}
            </p>
          </li>
        ) : (
          // File type was unable to be defined
          <li key={i}>Could not identify file type</li>
        ),
      )}
    </ul>
  );
}

// ---------- cat ----------

function FileView({ file }: { file: FileNode }) {
  switch (file._type) {
    case "aboutMe":
      return (
        <article className="motion-safe:animate-fade-in-content">
          <h2 className="text-ink mb-5">{file.name}</h2>
          <dl>
            {(["who", "what", "when", "where", "why"] as const).map(
              (key) =>
                file[key] && (
                  <div key={key}>
                    <dt className="text-ink font-semibold capitalize">{key}</dt>
                    <dd className="text-ink">{file[key]}</dd>
                  </div>
                ),
            )}
          </dl>
          <RichText blocks={file.body} />
        </article>
      );

    case "project":
      return (
        <article className="motion-safe:animate-fade-in-content">
          <h2 className="text-ink">{file.title}</h2>
          <p className="text-muted">{projectDates(file)}</p>
          {file.tech && (
            <ul className="flex flex-wrap gap-2 mb-5" aria-label="Tech stack">
              {file.tech.map((t) => (
                <li key={t} className="bg-pill text-pill-ink rounded-full px-3">
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
        <article className="motion-safe:animate-fade-in-content">
          <h2 className="text-ink">{file.title}</h2>
          {file.publishedAt && (
            <time dateTime={file.publishedAt} className="text-muted">
              {formatDate(file.publishedAt, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
          {file.shortDescription && (
            <p className="italic text-ink font-semibold mb-5">
              {file.shortDescription}
            </p>
          )}
          <RichText blocks={file.body} />
        </article>
      );
  }
}
