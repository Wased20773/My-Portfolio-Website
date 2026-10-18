// This is the general container for the output screen.

import { Output } from "@/data/type";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

type OutputScreenProps = {
  output: Output;
};

export default function OutputScreen({ output }: OutputScreenProps) {
  return (
    <div className="bg-stone-300 rounded-md p-3">
      <div className="grid grid-rows-1 grid-cols-2 gap-5">
        {/* Left Panel (folders) */}
        <nav
          className="bg-stone-500 rounded-md shadow-[-5px_9px_5px_0_rgb(0_0_0/0.25)] p-3"
          aria-label="Directory"
        >
          {/* Insert dynamicly generated navigation based on current directory selection */}
          <ul className="flex flex-col gap-2">
            <LeftPanel />
            {/* {directories?.map((data) => {
              return (
                data._type === "directory" && (
                  <li key={data._id}>
                    <button
                      type="button"
                      className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
                    >
                      {data.name}
                    </button>
                  </li>
                )
              );
            })} */}
          </ul>
        </nav>

        {/* Right Panel (files) */}
        {/* 
            NOTE: 
                Give section a heading such as the file name, plus aria-labelledby.
                Every nav click or typed via cd, move focus to that heading with tabIndex={-1}
        */}
        <section className="flex flex-col gap-3">
          <RightPanel output={output} />

          {/* {directories?.map((data) => {
              return (
                data._type !== "directory" && (
                  <li
                    key={data._id}
                    className="bg-stone-400 rounded-md px-2 px-1"
                  >
                    <button
                      type="button"
                      className="text-stone-800 text-center py-1 m-0"
                    >
                      {data.name}
                    </button>
                  </li>
                )
              );
            })} */}
        </section>
      </div>
    </div>
  );
}
