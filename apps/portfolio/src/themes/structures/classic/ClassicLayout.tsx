import Header from "./Header";
import type { LayoutProps } from "../types";
import Terminal from "./Terminal";
import OutputScreen from "./outputPanel/OutputScreen";

export default function ClassicLayout({ terminal }: LayoutProps) {
  return (
    <div>
      <Header />

      <main className="relative z-10 max-w-[1200px] mx-auto rounded-lg py-5 m-1 border-[0.15rem] border-monitor-border bg-monitor shadow-monitor-glow">
        <Terminal
          run={terminal.run}
          prompt={terminal.prompt}
          history={terminal.history}
          complete={terminal.complete}
          recall={terminal.recall}
        />
        <OutputScreen output={terminal.output} />
      </main>

      {/* <footer>this is the footer</footer> */}
    </div>
  );
}
