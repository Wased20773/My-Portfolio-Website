// This is the general container for the output screen.

import { Output } from "@/data/type";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

type OutputScreenResults = {
  output: Output;
  navOpen?: boolean;
};

export default function OutputScreen({ output }: { output: Output }) {
  // null output gets handled inside of the panels
  if (!output) return <OutputResults output={null} navOpen={false} />;

  switch (output.kind) {
    case "error":
      return <OutputResults output={output} navOpen={false} />;
    case "ls":
      return <OutputResults output={output} />;
    case "file":
      return <OutputResults output={output} navOpen={false} />;
  }
}

function OutputResults({ output, navOpen = true }: OutputScreenResults) {
  return (
    <div className="bg-stone-300 rounded-md p-3">
      <div className="grid grid-rows-1 grid-cols-[45%_55%] gap-3">
        {/* Left Panel (folders) */}
        {navOpen === true && (
          <nav
            className="bg-stone-500 rounded-md shadow-[-5px_9px_5px_0_rgb(0_0_0/0.25)] p-3"
            aria-label="Directory"
          >
            {/* Insert dynamicly generated navigation based on current directory selection */}
            <LeftPanel output={output} />
          </nav>
        )}

        {/* Right Panel (files) */}
        {/* 
            NOTE: 
                Give section a heading such as the file name, plus aria-labelledby.
                Every nav click or typed via cd, move focus to that heading with tabIndex={-1}
        */}
        <section
          className={`flex flex-col gap-3 p-3 ${navOpen ? "col-span-1" : "col-span-2"}`}
        >
          <RightPanel output={output} />
        </section>
      </div>
    </div>
  );
}
