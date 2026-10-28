"use client";

import { useState } from "react";
import Header from "./components/ui/Header";
import OutputScreen from "./components/ui/outputPanel/OutputScreen";
import Terminal from "./components/ui/Terminal";
import { Output } from "@/data/type";

export default function Home() {
  const [cwd, setCWD] = useState<string>("~/");
  const [output, setOutput] = useState<Output>(null);

  return (
    <div>
      <Header />

      <main className="max-w-[1200px] mx-auto">
        <Terminal cwd={cwd} setCWD={setCWD} setOutput={setOutput} />
        <OutputScreen output={output} />
      </main>

      <footer>this is the footer</footer>
    </div>
  );
}
