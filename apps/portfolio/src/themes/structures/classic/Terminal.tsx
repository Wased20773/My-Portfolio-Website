"use client";

import { useRef } from "react";

type TerminalProps = {
  run: (input: string) => void;
  prompt: string; // "bryan@portfolio:~$ " or the running script's question
  history: string[]; // lines a script printed into the terminal
  complete: (input: string) => string;
  recall: (step: -1 | 1) => string | null;
};

export default function Terminal({
  run,
  prompt,
  history,
  complete,
  recall,
}: TerminalProps) {
  const inputRef = useRef<HTMLSpanElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === "Tab") {
      const el = inputRef.current;
      const text = el?.textContent ?? "";
      if (!el || !text) return; // empty input: let Tab move focus as normal

      e.preventDefault(); // keep focus in the terminal
      setInput(el, complete(text)); // no trim, the trailing space matters
      return;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const el = inputRef.current;
      const line = recall(e.key === "ArrowUp" ? -1 : 1);
      if (!el || line === null) return;

      e.preventDefault(); // otherwise the browser moves the caret to the start/end
      setInput(el, line);
      return;
    }

    if (e.key !== "Enter") return;
    e.preventDefault(); // stop contentEditable from inserting a new line

    const input = inputRef.current?.textContent?.trim() ?? "";
    if (inputRef.current) inputRef.current.textContent = "";

    run(input);
  }

  function setInput(el: HTMLSpanElement, text: string) {
    el.textContent = text;
    // Replacing textContent moves the caret to the start, so put it back at the end
    const selection = window.getSelection();
    selection?.selectAllChildren(el);
    selection?.collapseToEnd();
  }

  return (
    <div className="cursor-text mx-5 my-2">
      <p className="opacity-75">
        Terminal: Type &quot;help&quot; to view available commands.
      </p>
      <div
        onClick={() => inputRef.current?.focus()}
        onKeyDown={handleKeyDown}
        className="rounded-sm cursor-text bg-terminal px-2 py-1 font-mono"
      >
        {/* Script lines; role="log" lets screen readers announce each new one */}
        <div role="log">
          {history.map((line, i) => (
            <p
              key={i}
              className="whitespace-pre-wrap break-all text-terminal-ink"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="text-terminal-ink">
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
