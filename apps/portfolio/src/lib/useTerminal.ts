import { useState } from "react";
import { Output } from "@/data/type";
import { completePath, getDirectory, getFile, resolvePath } from "./fs";
import { commands, isCommand } from "./commands";
import { useTheme } from "@/themes/ThemeProvider";
// import { isThemeName } from "@/themes/themes";
import { isScript, ScriptName, scripts } from "./scripts";
import { isModeName, modes } from "@/themes/themes";

export function useTerminal() {
  const [cwd, setCWD] = useState<string>("~/");
  const [output, setOutput] = useState<Output>(null);
  // const { setTheme } = useTheme();
  const { setMode } = useTheme();

  // Must check if there is a running script
  const [running, setRunning] = useState<{
    name: ScriptName; // e.g. "contact.sh"
    step: number;
    answers: Record<string, string>;
  } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  // true while a script's onFinish is working (e.g. sending the email)
  const [busy, setBusy] = useState(false);

  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [browsing, setBrowsing] = useState<number | null>(null); // null = not browsing, on a fresh line

  function addLine(line: string) {
    setHistory((prev) => [...prev, line]);
  }

  // Longest start shared by every match: ["projects/", "project-x.md"] → "project"
  function commonPrefix(words: string[]) {
    return words.reduce((a, b) => {
      let i = 0;
      while (i < a.length && a[i] === b[i]) i++;
      return a.slice(0, i);
    });
  }

  function complete(input: string) {
    if (running) return input; // no completing a script's answers

    const words = input.split(" ");
    const word = words.pop() ?? ""; // the word being completed
    const command = words[0]; // undefined while typing the first word

    let matches: string[];
    if (!command) {
      matches = word.startsWith("./")
        ? completePath(word.slice(2), cwd)
            .filter(isScript)
            .map((n) => `./${n}`)
        : Object.keys(commands).filter((c) => c !== "./" && c.startsWith(word));
    } else if (command === "help") {
      matches = Object.keys(commands).filter((c) => c.startsWith(word));
    } else if (command === "mode") {
      matches = modes.filter((m) => m.startsWith(word));
    } else {
      matches = completePath(word, cwd, command === "cd" || command === "ls");
    }

    if (matches.length === 0) return input;

    let done = matches.length === 1 ? matches[0] : commonPrefix(matches);
    if (matches.length === 1 && !done.endsWith("/")) done += " "; // finished word
    return [...words, done].join(" ");
  }

  // ↑ = -1 (older), ↓ = +1 (newer). Returns the line to show, or null to do nothing
  function recall(step: -1 | 1) {
    if (running || pastCommands.length === 0) return null;

    const from = browsing ?? pastCommands.length; // fresh line sits just past the newest
    const next = Math.min(Math.max(from + step, 0), pastCommands.length);

    setBrowsing(next === pastCommands.length ? null : next);
    return next === pastCommands.length ? "" : pastCommands[next]; // past the newest → empty line
  }

  // Nothing while busy, the question while a script runs, otherwise cwd
  const prompt = busy
    ? ""
    : running
      ? scripts[running.name].steps[running.step].prompt
      : `bryan@portfolio:${cwd.replace(/\/$/, "")}$ `;

  async function run(input: string) {
    if (busy) return; // ignore Enter until the script is done

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
        addLine("Sending...");
        setRunning(null);
        setBusy(true); // hides the prompt and locks input while we wait
        try {
          addLine(await script.onFinish(answers));
        } finally {
          setBusy(false); // always unlock, even if onFinish throws
        }
      }
      return; // prevents answers to be treated as commands
    }

    setBrowsing(null); // Enter always brings you back to a fresh line
    if (input) {
      // skip repeats, so pressing ↑ doesn't step through "ls, ls, ls"
      setPastCommands((prev) =>
        prev.at(-1) === input ? prev : [...prev, input],
      );
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

      case "mode": {
        if (!arg) {
          setOutput({
            kind: "error",
            message: "mode: missing argument (light | dark)",
          });
        } else if (isModeName(arg)) {
          setMode(arg);
        } else {
          setOutput({
            kind: "error",
            message: `mode: '${arg}' is not a mode (light | dark)`,
          });
        }
        break;
      }

      case "": {
        break;
      }

      default: {
        setOutput({ kind: "error", message: `${command}: command not found` });
      }
    }
  }

  return { cwd, output, run, prompt, history, complete, recall, busy };
}

export type TerminalState = ReturnType<typeof useTerminal>; // { cwd, output, run, prompt, history }
