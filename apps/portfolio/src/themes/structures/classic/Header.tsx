import RotatingTypewriter, {
  RotatingTypewriterPhrase,
} from "@/themes/shared/RotatingTypewriter";
import { useTheme } from "@/themes/ThemeProvider";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import ModeSwitch from "./ModeSwitch";
import Image from "next/image";
import { useState } from "react";

const phrases: RotatingTypewriterPhrase[] = [
  { text: "Sofware Engineer", variant: "normal" },
  { text: "React Developer", variant: "highlight" },
  { text: "Full-Stack Developer", variant: "highlight" },
  { text: "UI Developer", variant: "underline" },
  { text: "Freelancer", variant: "normal" },
  { text: "Product Builder.", variant: "bold" },
];

const stars = [
  { top: "5%", left: "62%", dur: 2.3, delay: 0 },
  { top: "18%", left: "88%", dur: 3.1, delay: 0.4 },
  { top: "40%", left: "70%", dur: 1.9, delay: 1.1 },
  { top: "62%", left: "93%", dur: 2.7, delay: 0.7 },
  { top: "8%", left: "97%", dur: 3.6, delay: 1.6 },
  { top: "75%", left: "66%", dur: 2.1, delay: 0.2 },
];

export default function Header() {
  const { mode, setMode } = useTheme();
  const [turns, setTurns] = useState(0);
  const [prevMode, setPrevMode] = useState(mode);

  // Whenever the mode changes (orb, mobile switch, anywhere), add a half-turn
  // so the wheel always keeps spinning the same way: 0° → 180° → 360° → ...
  if (mode !== prevMode) {
    setPrevMode(mode);
    setTurns((t) => t + 1);
  }

  return (
    <header>
      {/* Top Heading */}
      <div className="relative z-10 flex justify-between items-center bg-topbar px-3 py-1">
        {/* Left: mode switch (mobile only) */}
        <ModeSwitch mode={mode} setMode={setMode} />

        {/* Right: existing links */}
        <ul
          className="flex items-center flex-wrap gap-4"
          aria-label="My Social links"
        >
          {/* Maybe add a dropdown button to show all my social links below w-[400px]? */}
          <li>
            <a
              className="flex gap-2"
              href="https://www.linkedin.com/in/bryan-vazquez-7657b8214"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Go to my LinkedIn"
            >
              <FaLinkedinIn size={24} className="text-[#0A66C2]" />
              <span className="hidden sm:block text-topbar-ink">LinkedIn</span>
            </a>
          </li>

          <li>
            <a
              className="flex gap-2"
              href="https://github.com/Wased20773"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Go to my GitHub"
            >
              <FaGithub size={24} className="text-topbar-ink" />
              <span className="hidden sm:block text-topbar-ink">GitHub</span>
            </a>
          </li>

          {/* TODO: Change to button when contact-me content has been created */}
          <li>
            <a className="flex gap-2" href="#">
              <MdOutlineEmail size={24} className="text-accent" />
              <span className="text-topbar-ink">
                Bvazquez1745<span className="text-accent">@</span>gmail.com
              </span>
            </a>
          </li>
        </ul>
      </div>

      {/* Introductory Heading */}
      <div className="relative isolate max-w-[800px] mx-auto mt-1">
        {/* Stars: decoration only, fade out in light mode */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 motion-safe:transition-opacity motion-safe:duration-700 ${
            mode === "dark" ? "opacity-100" : "opacity-0"
          }`}
        >
          {stars.map((s, i) => (
            <span
              key={i}
              style={
                {
                  top: s.top,
                  left: s.left,
                  "--dur": `${s.dur}s`,
                  "--delay": `${s.delay}s`,
                } as React.CSSProperties
              }
              className="absolute size-1 rounded-full bg-star shadow-[0_0_6px_var(--color-star)] motion-safe:animate-twinkle"
            />
          ))}
        </div>

        <button
          className="absolute right-5 -z-10 sm:z-10 size-20 sm:size-28 motion-safe:duration-500 motion-safe:transition-[scale] hover:scale-105 focus-visible:scale-105 ease-out"
          type="button"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          aria-label={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {/* Wheel: any angle, so it goes in style (Tailwind can't make a class per value) */}
          <div
            style={{ rotate: `${turns * -180}deg` }}
            className="pointer-events-none absolute inset-0 origin-[50%_250%] motion-safe:transition-[rotate] motion-safe:duration-700 ease-in-out"
          >
            {/* Moon: top of wheel */}
            <div
              className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500 ${
                mode === "dark" ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/mode/moon.png"
                alt=""
                fill
                aria-hidden="true"
                className="object-contain [filter:var(--moon-glow)] motion-safe:animate-sway"
              />
            </div>

            {/* Sun: bottom of wheel */}
            <div
              className={`absolute inset-0 origin-[50%_250%] rotate-180 motion-safe:transition-opacity motion-safe:duration-500 ${
                mode === "light" ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/mode/sun.png"
                alt=""
                fill
                aria-hidden="true"
                className="object-contain [filter:var(--sun-glow)] motion-safe:animate-sway"
              />
            </div>
          </div>
        </button>
        <div className="relative">
          <span
            aria-hidden="true"
            className="border-[0.15rem] border-hero-shape-border-color motion-safe:animate-morph shape-hero absolute -left-6 -inset-y-4 -z-10 w-72 max-w-full bg-hero-shape"
          />

          <h1 className="motion-safe:animate-wipe w-fit !text-5xl text-header">
            Bryan Vazquez
          </h1>
          <p className="!text-3xl">
            I am a{" "}
            <RotatingTypewriter
              phrases={phrases}
              pause={1500}
              startDelay={2000}
            />
          </p>
        </div>
      </div>

      <div className="relative max-w-[1000px] mx-auto">
        <p className="text-center my-10">
          Building apps to solve{" "}
          <span className="font-semibold">real problems</span>, type-safety,
          accessibility friendly, and creating seamless interfaces from complex
          problems.
        </p>
      </div>
    </header>
  );
}
