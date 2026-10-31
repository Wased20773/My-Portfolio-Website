import { useState } from "react";
import { Output } from "@/data/type";
import { getDirectory, getFile, resolvePath } from "./fs";
import { isCommand } from "./commands";
// import { useTheme } from "@/themes/ThemeProvider";
// import { isThemeName } from "@/themes/themes";
import { isScript, ScriptName, scripts } from "./scripts";

export function useTerminal() {
  const [cwd, setCWD] = useState<string>("~/");
  const [output, setOutput] = useState<Output>(null);
  // const { setTheme } = useTheme();

  // Must check if there is a running script
  const [running, setRunning] = useState<{
    name: ScriptName; // e.g. "contact.sh"
    step: number;
    answers: Record<string, string>;
  } | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  function addLine(line: string) {
    setHistory((prev) => [...prev, line]);
  }

  // The question to show, or cwd when no script is running
  const prompt = running
    ? scripts[running.name].steps[running.step].prompt
    : `bryan@portfolio:${cwd.replace(/\/$/, "")}$ `;

  async function run(input: string) {
    if (running) {
      const script = scripts[running.name];
      const step = script.steps[running.step];
      const answers = { ...running.answers, [step.field]: input };

      // Let the user cancel the script
      if (input === "exit") {
        addLine("Cancelled.");
        setRunning(null);
      } else if (running.step + 1 < script.steps.length) {
        addLine(`${step.prompt}${input}`);
        setRunning({ ...running, step: running.step + 1, answers }); // next question
      } else {
        addLine(`${step.prompt}${input}`);
        addLine(script.onFinish(answers));
        setRunning(null);
      }
      return; // prevents answers to be treated as commands
    }
    const [command, arg] = input.split(/\s+/);

    if (command.startsWith("./")) {
      const name = command.slice(2); // ""./contact.sh" -> "contact.sh"

      if (isScript(name)) {
        setRunning({ name, step: 0, answers: {} });
        // Echo the command line, like a real terminal ("bryan@portfolio:~$ ./contact.sh")
        setHistory([`${prompt}${input}`, `Type "exit" to cancel.`]);
      } else {
        setOutput({
          kind: "error",
          message: `bash: ${command}: No such file or directory`,
        });
      }
      return; // we dont want to parse with ./ in the switch
    }

    switch (command) {
      case "help": {
        // help with specific cmd or show all cmds
        if (!arg) {
          setOutput({ kind: "help", cmds: "all" });
        } else if (isCommand(arg)) {
          setOutput({ kind: "help", cmds: arg });
        } else {
          setOutput({
            kind: "error",
            message: `help: no help topics match '${arg}'`,
          });
        }
        break;
      }

      case "cd": {
        const target = resolvePath(arg ?? "~", cwd); // plain `cd` goes home
        if (await getDirectory(target)) {
          setCWD(target);
          setOutput(null);
        } else {
          setOutput({
            kind: "error",
            message: `cd: ${arg}: No such file or directory`,
          });
        }
        break;
      }

      case "ls": {
        const dir = await getDirectory(resolvePath(arg ?? ".", cwd)); // plain `ls` = here
        if (dir) setOutput({ kind: "ls", dir });
        else
          setOutput({
            kind: "error",
            message: `ls: cannot access '${arg}': No such file or directory`,
          });
        break;
      }

      case "cat": {
        if (!arg) break;
        const file = await getFile(arg, cwd);
        if (file) setOutput({ kind: "file", file });
        else
          setOutput({
            kind: "error",
            message: `cat: ${arg}: No such file or directory`,
          });
        break;
      }

      case "clear": {
        if (arg) {
          setOutput({
            kind: "error",
            message: `clear ${arg}: Did you mean clear?`,
          });
        } else {
          setOutput(null);
          setHistory([]); // also clears script lines in the terminal
        }
        break;
      }

      // case "theme": {
      //   if (!arg) break;
      //   if (!isThemeName(arg)) break;
      //   else setTheme(arg);
      //   break;
      // }

      case "": {
        break;
      }

      default: {
        setOutput({ kind: "error", message: `${command}: command not found` });
      }
    }
  }

  return { cwd, output, run, prompt, history };
}

export type TerminalState = ReturnType<typeof useTerminal>; // { cwd, output, run, prompt, history }
