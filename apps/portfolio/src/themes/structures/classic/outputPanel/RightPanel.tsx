// Where terminal cmd output lives

import { Fragment } from "react";
import { commands, withCode, type CommandTypes } from "@/lib/commands";
import { formatDate, projectDates } from "@/lib/dates";
import RichText from "@/themes/shared/RichText";
import type { Directory, FileNode, Output } from "@/data/type";

export default function RightPanel({ output }: { output: Output }) {
  if (!output) return null;

  switch (output.kind) {
    case "error":
      return <p className="font-mono text-danger">{output.message}</p>;

    case "help":
      return <HelpView cmd={output.cmds} />;

    case "ls":
      return <Listing dir={output.dir} />;

    case "file":
      return <FileView file={output.file} />;
  }
}

// ---------- help ----------
function HelpView({ cmd }: { cmd: CommandTypes | "all" }) {
  if (cmd === "all") {
    return (
      <div className="motion-safe:animate-fade-in-content font-mono text-ink">
        <div className="mb-5">
          <div className="flex flex-col gap-5">
            <p>
              A mock version of the Linux experience with my personal custom
              made features & UI. Not everything is 1:1 like how output is
              rendered with <code>ls</code>. I plan to make more features as I
              continue developing this portfolio!
            </p>
            <div>
              <p>To catch up on the latest features go to my newsletter:</p>
              <p>
                - <code>cd ~/newsletter</code>
              </p>
              <p>
                - <code>cat</code> the latest post regarding terminal features.
              </p>
            </div>

            <div>
              <p>
                Type <code>help</code> to see this list.
              </p>
              <p>
                Type <code>help [command]</code> to get more info about the
                command.
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-5">
          {Object.entries(commands).map(([name, c]) => (
            <Fragment key={name}>
              <dt className="font-semibold">{c.usage}</dt>
              <dd>{c.description}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    );
  }

  // help [command] -> details + examples for just that one

  const c = commands[cmd];

  return (
    <div className="motion-safe:animate-fade-in-content font-mono text-ink">
      <h2>{c.usage}</h2>
      <p className="mb-5">{withCode(c.details)}</p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-5">
        {c.info.map((ex) => (
          <Fragment key={ex.usage}>
            <dt className="font-semibold">{ex.usage}</dt>
            <dd>{ex.description}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
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
