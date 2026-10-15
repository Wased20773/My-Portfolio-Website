import Header from "./components/ui/Header";
import Terminal from "./components/ui/Terminal";
export default function Home() {
  return (
    <div>
      <Header />
      {/* Top heading */}
      <h1>Bryan Vazquez</h1>
      <h2 className="opacity-50">React Front-end Developer</h2>

      <p>
        Building apps to solve{" "}
        <span className="font-semibold">real problems</span>, type-safety,
        accessibility friendly, and creating seamless interfaces from complex
        problems.
      </p>

      {/* Insert animated text */}

      <Terminal />

      <main>
        {/* Left side */}

        {/* Right side */}
      </main>
    </div>
  );
}
