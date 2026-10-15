export default function OutputScreen() {
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
            <li>
              <button
                type="button"
                className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
              >
                {/* NOTE: Only show this when cwd !== "~" */}
                ../
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
              >
                about-me.md
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
              >
                projects/
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
              >
                newsletter/
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-stone-800 rounded-full text-stone-300 text-center py-1"
              >
                contact.bash
              </button>
            </li>
          </ul>
        </nav>

        {/* Right Panel (files) */}
        {/* 
            NOTE: 
                Give section a heading such as the file name, plus aria-labelledby.
                Every nav click or typed via cd, move focus to that heading with tabIndex={-1}
        */}
        <section className="flex flex-col gap-3">
          {/* Populate content here after interaction (Props) */}
        </section>
      </div>
    </div>
  );
}
