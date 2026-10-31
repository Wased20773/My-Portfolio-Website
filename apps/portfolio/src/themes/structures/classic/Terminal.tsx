"use client";

import { useRef } from "react";

type TerminalProps = {
  run: (input: string) => void;
  prompt: string; // "bryan@portfolio:~$ " or the running script's question
  history: string[]; // lines a script printed into the terminal
};

export default function Terminal({ run, prompt, history }: TerminalProps) {
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
        Terminal: Type &quot;help&quot; to view available commands.
      </p>
      <div
        onClick={() => inputRef.current?.focus()}
        onKeyDown={handleKeyDown}
        className="cursor-text bg-terminal p-1 font-mono"
      >
        {/* Script lines; role="log" lets screen readers announce each new one */}
        <div role="log">
          {history.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap break-all">
              {line}
            </p>
          ))}
        </div>

        <div>
          <span>{prompt}</span>
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
    </div>
  );
}
