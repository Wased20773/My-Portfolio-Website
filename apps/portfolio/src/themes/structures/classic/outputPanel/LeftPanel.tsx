// Where terminal navigation lives

import { Directory, Output } from "@/data/type";
import type { Nav } from "./OutputScreen";

export default function LeftPanel({
  output,
  nav,
}: {
  output: Output;
  nav: Nav;
}) {
  if (!output) return null;

  switch (output.kind) {
    case "error":
      return;
    case "ls":
      return <Listing dir={output.dir} nav={nav} />;
  }
}

// ---------- ls ----------

function Listing({ dir, nav }: { dir: Directory; nav: Nav }) {
  return (
    <ul className="grid md:flex md:flex-col gap-2 flex-wrap font-mono">
      {dir.folders.map((f) => (
        <li
          key={f.cwd}
          className="text-chip-ink rounded-md bg-chip relative has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 px-2 py-1"
        >
          {nav ? (
            <button
              type="button"
              onClick={() => nav.openFolder(f.cwd)}
              className="outline-none after:absolute after:inset-0 after:rounded-md"
            >
              {f.name}/
            </button>
          ) : (
            <>{f.name}/</>
          )}
        </li>
      ))}
    </ul>
  );
}
