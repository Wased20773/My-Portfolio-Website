"use client";

import { Output } from "@/data/type";
import { getDirectory, getFile, resolvePath } from "@/lib/fs";
import { Dispatch, SetStateAction, useRef } from "react";

type TerminalProps = {
  cwd: string;
  setCWD: Dispatch<SetStateAction<string>>;
  setOutput: Dispatch<SetStateAction<Output>>;
};

export default function Terminal({ cwd, setCWD, setOutput }: TerminalProps) {
  const inputRef = useRef<HTMLSpanElement>(null);

  async function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault(); // stop contentEditable from inserting a new line

    const input = inputRef.current?.textContent?.trim() ?? "";
    if (inputRef.current) inputRef.current.textContent = "";

    const [command, arg] = input.split(/\s+/);

    switch (command) {
      case "cd": {
        const target = resolvePath(arg ?? "~", cwd); // plain `cd` goes home
        if (await getDirectory(target)) {
          setCWD(target);
          setOutput(null);
        } else {
          setOutput({
            kind: "error",
            message: `cd: ${arg}: No such file or directory`,
          });
        }
        break;
      }
      case "ls": {
        const dir = await getDirectory(resolvePath(arg ?? ".", cwd)); // plain `ls` = here
        if (dir) setOutput({ kind: "ls", dir });
        else
          setOutput({
            kind: "error",
            message: `ls: cannot access '${arg}': No such file or directory`,
          });
        break;
      }
      case "cat": {
        if (!arg) break;
        const file = await getFile(arg, cwd);
        if (file) setOutput({ kind: "file", file });
        else
          setOutput({
            kind: "error",
            message: `cat: ${arg}: No such file or directory`,
          });
        break;
      }
      case "clear": {
        if (arg) {
          setOutput({
            kind: "error",
            message: `clear ${arg}: Did you mean clear?`,
          });
        } else setOutput(null);
      }
      case "":
        break;
      default:
        setOutput({ kind: "error", message: `${command}: command not found` });
    }
  }

  return (
    <div className="cursor-text m-1">
      <p className="opacity-75">
        Terminal: Type `&quot;` to view all commands.
      </p>
      <div
        onClick={() => inputRef.current?.focus()}
        onKeyDown={handleKeyDown}
        className="cursor-text bg-stone-950 p-1 font-mono"
      >
        <span>bryan@portfolio:{cwd.replace(/\/$/, "")}$ </span>
        <span
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Terminal command"
          tabIndex={0}
          spellCheck={false}
          className="whitespace-pre-wrap break-all outline-none"
        />
      </div>
    </div>
  );
}
