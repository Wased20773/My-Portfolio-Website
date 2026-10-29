"use client";

import { useRef } from "react";

type TerminalProps = {
  cwd: string;
  run: (input: string) => void;
};

export default function Terminal({ cwd, run }: TerminalProps) {
  const inputRef = useRef<HTMLSpanElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault(); // stop contentEditable from inserting a new line

    const input = inputRef.current?.textContent?.trim() ?? "";
    if (inputRef.current) inputRef.current.textContent = "";

    run(input);
  }

  return (
    <div className="cursor-text m-1">
      <p className="opacity-75">
        Terminal: Type `&quot;` to view all commands.
      </p>
      <div
        onClick={() => inputRef.current?.focus()}
        onKeyDown={handleKeyDown}
        className="cursor-text bg-terminal p-1 font-mono"
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
