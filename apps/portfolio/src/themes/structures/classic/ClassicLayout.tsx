import Header from "./Header";
import type { LayoutProps } from "../types";
import Terminal from "./Terminal";
import OutputScreen from "./outputPanel/OutputScreen";

export default function ClassicLayout({ terminal }: LayoutProps) {
  return (
    <div>
      <Header />

      <main className="max-w-[1200px] mx-auto">
        <Terminal
          run={terminal.run}
          prompt={terminal.prompt}
          history={terminal.history}
        />
        <OutputScreen output={terminal.output} />
      </main>

      {/* <footer>this is the footer</footer> */}
    </div>
  );
}
