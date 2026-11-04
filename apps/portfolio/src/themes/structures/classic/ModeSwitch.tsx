import { Mode } from "@/themes/ThemeProvider";

type ModeSwitchProps = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export default function ModeSwitch({ mode, setMode }: ModeSwitchProps) {
  return (
    <div className="h-6 w-12 sm:hidden relative p-0.5 bg-stone-700 rounded-full border-[0.1rem] border-stone-500">
      {/* darkmode = slate-400 */}
      {/* lightmode = yellow-400 */}
      <button
        className={`${mode === "dark" ? "bg-slate-400 translate-x-0" : "bg-yellow-400 translate-x-6"} block h-full aspect-square rounded-full motion-safe:transition-[translate,background-color] motion-safe:duration-200 ease-in-out`}
        type="button"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        aria-label={
          mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      ></button>
    </div>
  );
}
