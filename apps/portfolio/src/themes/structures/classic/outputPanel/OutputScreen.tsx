// This is the general container for the output screen.

import { FileNode, Output } from "@/data/type";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

export type NavActions = {
  openFolder: (path: string) => void;
  openFile: (dirPath: string, file: FileNode) => void;
};

export type Nav = NavActions | null; // null = terminal mode

type OutputScreenResults = {
  output: Output;
  navOpen?: boolean;
  nav: Nav;
};

export default function OutputScreen({
  output,
  terminalMode,
  nav,
}: {
  output: Output;
  terminalMode: boolean;
  nav: NavActions;
}) {
  const navOpen = output?.kind !== "help" && output?.kind !== "file";

  return (
    <OutputResults
      output={output}
      navOpen={navOpen}
      nav={terminalMode ? null : nav}
    />
  );
}

function OutputResults({ output, navOpen = true, nav }: OutputScreenResults) {
  return (
    <div className="min-h-[100px] bg-surface rounded-md overflow-hidden p-3 m-2">
      <div
        key={outputKey(output)}
        className="grid grid-rows-[auto_auto_1fr] grid-cols-1 md:grid-rows-1 md:grid-cols-[30%_auto_1fr] gap-3"
      >
        {/* Left Panel (folders) */}
        {navOpen === true && (
          <nav
            className="min-h-[50px] md:min-h-[100px] bg-panel rounded-md p-3"
            aria-label="Directory"
          >
            {/* Insert dynamicly generated navigation based on current directory selection */}
            <LeftPanel output={output} nav={nav} />
          </nav>
        )}

        {navOpen && (
          <div className="border-l-[0.15rem] border-t-[0.15rem] border-divider border-dashed"></div>
        )}

        {/* Right Panel (files) */}
        {/* 
            NOTE: 
                Give section a heading such as the file name, plus aria-labelledby.
                Every nav click or typed via cd, move focus to that heading with tabIndex={-1}
        */}
        <section className={navOpen ? "col-span-1" : "col-span-full"}>
          <RightPanel output={output} nav={nav} />
        </section>
      </div>
    </div>
  );
}

// A new key remounts the panels, which replays their entrance animation
function outputKey(output: Output): string {
  if (!output) return "empty";
  switch (output.kind) {
    case "help":
      return `help:${output.cmds}`;

    case "ls":
      return `ls:${output.dir.cwd}`;

    case "file":
      return `file:${output.file._id}`;

    case "error":
      return `error:${output.message}`;
  }
}
