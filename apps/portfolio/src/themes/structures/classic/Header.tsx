import RotatingTypewriter, {
  RotatingTypewriterPhrase,
} from "@/themes/shared/RotatingTypewriter";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const phrases: RotatingTypewriterPhrase[] = [
  { text: "Sofware Engineer", variant: "mute" },
  { text: "React Developer", variant: "highlight" },
  { text: "Full-Stack Developer", variant: "highlight" },
  { text: "Product Builder", variant: "highlight" },
  { text: "Freelancer", variant: "normal" },
  { text: "UI Developer.", variant: "underline" },
];

export default function Header() {
  return (
    <header>
      {/* Top Heading */}
      <ul
        className="relative z-10 flex justify-end items-center flex-wrap gap-4 bg-topbar px-3 py-1"
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
            <span className="hidden sm:block text-[#0A66C2]">LinkedIn</span>
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
            <FaGithub size={24} className="text-white" />
            <span className="hidden sm:block text-white">GitHub</span>
          </a>
        </li>

        {/* TODO: Change to button when contact-me content has been created */}
        <li>
          <a className="flex gap-2" href="#">
            <MdOutlineEmail size={24} className="text-accent" />
            <span className="text-white">
              Bvazquez1745<span className="text-accent">@</span>gmail.com
            </span>
          </a>
        </li>
      </ul>

      {/* Introductory Heading */}
      <div className="relative isolate max-w-[1200px] mx-auto mt-1">
        <div className="relative">
          <span
            aria-hidden="true"
            className="border-[0.2rem] border-hero-shape-border-color motion-safe:animate-morph shape-hero absolute -left-6 -top-4 -z-10 h-32 w-72 max-w-full bg-hero-shape"
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

        <p className="text-center my-5">
          Building apps to solve{" "}
          <span className="font-semibold">real problems</span>, type-safety,
          accessibility friendly, and creating seamless interfaces from complex
          problems.
        </p>
      </div>
    </header>
  );
}
