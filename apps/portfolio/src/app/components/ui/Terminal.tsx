"use client";

import { useRef } from "react";

export default function Terminal() {
  const inputRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="cursor-text m-1">
      <p className="opacity-75">Termainl: Type "help" to view all commands.</p>
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text bg-stone-950 p-1 font-mono"
      >
        <span>bryan:~$ </span>
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
