// Where terminal navigation lives

import { Directory, Output } from "@/data/type";

export default function LeftPanel({ output }: { output: Output }) {
  if (!output) return null;

  switch (output.kind) {
    case "error":
      return;
    case "ls":
      return <Listing dir={output.dir} />;
  }
}

// ---------- ls ----------

function Listing({ dir }: { dir: Directory }) {
  return (
    <ul className="flex gap-2 flex-wrap font-mono">
      {dir.folders.map((f) => (
        <li
          key={f.cwd}
          className="w-full truncate text-gray-800 rounded-md bg-gray-300 px-2 py-1"
        >
          {f.name}/
        </li>
      ))}
    </ul>
  );
}
