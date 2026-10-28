import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function Header() {
  return (
    <header>
      {/* Top Heading */}
      <ul
        className="flex justify-end items-center flex-wrap gap-4 bg-stone-950 px-3 py-1"
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
            <MdOutlineEmail size={24} className="text-red-500" />
            <span>
              Bvazquez1745<span className="text-red-500">@</span>gmail.com
            </span>
          </a>
        </li>
      </ul>

      {/* Introductory Heading */}
      <div className="max-w-[1200px] mx-auto mt-1">
        <h1 className="!text-5xl">Bryan Vazquez</h1>
        <p className="!text-3xl opacity-50 font-normal">
          React Front-end Developer
        </p>

        <p className="text-center">
          Building apps to solve{" "}
          <span className="font-semibold">real problems</span>, type-safety,
          accessibility friendly, and creating seamless interfaces from complex
          problems.
        </p>

        {/* Insert animated text */}
      </div>
    </header>
  );
}
