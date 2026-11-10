import Header from "./Header";
import type { LayoutProps } from "../types";
import Terminal from "./Terminal";
import OutputScreen from "./outputPanel/OutputScreen";
import Image from "next/image";
import BackArrow from "@/themes/shared/icons/BackArrow";

export default function ClassicLayout({ terminal }: LayoutProps) {
  return (
    <div>
      <Header />

      <main className="relative z-10 max-w-[1200px] mx-auto rounded-lg py-5 m-1 border-[0.15rem] border-monitor-border bg-monitor shadow-monitor-glow">
        <div className="mx-5 mb-2 flex items-center gap-2">
          {terminal.backTo && (
            <button
              type="button"
              onClick={terminal.goBack}
              disabled={terminal.busy}
              aria-label={`Back to ${terminal.backTo}`}
              className="flex items-center gap-2 font-mono rounded-sm bg-chip px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BackArrow className="h-4 w-6" />
            </button>
          )}
          <button
            className="ml-auto font-mono rounded-sm bg-chip text-chip-ink disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1"
            type="button"
            onClick={terminal.toggleTerminalMode}
            disabled={terminal.busy}
          >
            Terminal Mode: {terminal.terminalMode ? "ON" : "OFF"}
          </button>
        </div>
        {terminal.terminalMode && (
          <Terminal
            run={terminal.run}
            prompt={terminal.prompt}
            history={terminal.history}
            complete={terminal.complete}
            recall={terminal.recall}
            busy={terminal.busy}
          />
        )}
        <OutputScreen
          output={terminal.output}
          terminalMode={terminal.terminalMode}
          nav={{ openFolder: terminal.openFolder, openFile: terminal.openFile }}
        />
      </main>

      {/* <footer>this is the footer</footer> */}
    </div>
  );
}
