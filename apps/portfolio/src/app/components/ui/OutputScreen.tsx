type OutputScreenProps = {
  directories: any;
};

export default function OutputScreen({ directories }: OutputScreenProps) {
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
            {directories?.map((data) => {
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
            })}
          </ul>
        </nav>

        {/* Right Panel (files) */}
        {/* 
            NOTE: 
                Give section a heading such as the file name, plus aria-labelledby.
                Every nav click or typed via cd, move focus to that heading with tabIndex={-1}
        */}
        <section className="flex flex-col gap-3">
          <ul className="flex gap-5 flex-wrap">
            {directories?.map((data) => {
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
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
