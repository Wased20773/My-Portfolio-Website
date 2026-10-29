import Header from "./Header";
import type { LayoutProps } from "../types";
import Terminal from "./Terminal";
import OutputScreen from "./outputPanel/OutputScreen";

export default function ClassicLayout({ terminal }: LayoutProps) {
  return (
    <div>
      <Header />

      <main className="max-w-[1200px] mx-auto">
        <Terminal cwd={terminal.cwd} run={terminal.run} />
        <OutputScreen output={terminal.output} />
      </main>

      <footer>this is the footer</footer>
    </div>
  );
}
