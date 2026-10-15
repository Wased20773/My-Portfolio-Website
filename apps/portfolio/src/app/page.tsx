import Header from "./components/ui/Header";
import Terminal from "./components/ui/Terminal";
export default function Home() {
  return (
    <div>
      <Header />
      {/* Top heading */}
      <h1 className="!text-5xl">Bryan Vazquez</h1>
      <h2 className="!text-3xl opacity-50 font-normal">
        React Front-end Developer
      </h2>

      <p className="text-center">
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
