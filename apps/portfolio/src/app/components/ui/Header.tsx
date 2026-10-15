import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function Header() {
  return (
    <div className="max-w-full bg-stone-950 px-3 py-1">
      <div className="flex justify-end items-center flex-wrap gap-4">
        {/* Maybe add a dropdown button to show all my social links below w-[400px]? */}
        <Link
          className="flex gap-2"
          href="https://www.linkedin.com/in/bryan-vazquez-7657b8214"
        >
          <FaLinkedinIn size={24} className="text-[#0A66C2]" />
          <p className="hidden sm:block text-[#0A66C2]">LinkedIn</p>
        </Link>

        <Link className="flex gap-2" href="https://github.com/Wased20773">
          <FaGithub size={24} className="text-white" />
          <p className="hidden sm:block text-white">GitHub</p>
        </Link>

        <Link className="flex gap-2" href="#">
          <MdOutlineEmail size={24} className="text-red-500" />
          <p className="">
            Bvazquez1745<span className="text-red-500">@</span>gmail.com
          </p>
        </Link>
      </div>
    </div>
  );
}
