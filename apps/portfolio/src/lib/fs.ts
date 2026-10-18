import data from "@/data/query-result.json";
import type { Directory } from "@/data/type";

const dirs = new Map((data as Directory[]).map((d) => [d.cwd, d]));

export async function getDirectory(cwd: string) {
  return dirs.get(cwd);
}

// Turn typed input ("projects", "..", "~/projects/personal") into a full path like "~/projects/"
export function resolvePath(input: string, cwd: string) {
  // Absolute paths start from ~, relative ones from the current folder
  const parts = input.startsWith("~") ? [] : cwd.split("/").slice(1, -1);

  for (const part of input.replace(/^~\/?/, "").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }

  return parts.length ? `~/${parts.join("/")}/` : "~/";
}

// "about-me.md", "../projects/x.md", "~/newsletter/post.md" → the file, if it exists
export async function getFile(input: string, cwd: string) {
  const slash = input.lastIndexOf("/");
  const dir = dirs.get(
    resolvePath(slash >= 0 ? input.slice(0, slash) : ".", cwd),
  );
  return dir?.files.find((f) => f.name === input.slice(slash + 1));
}
