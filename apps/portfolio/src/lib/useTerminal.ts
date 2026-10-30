import { useState } from "react";
import { Output } from "@/data/type";
import { getDirectory, getFile, resolvePath } from "./fs";
import { isCommand } from "./commands";
import { useTheme } from "@/themes/ThemeProvider";
import { isThemeName } from "@/themes/themes";

export function useTerminal() {
  const [cwd, setCWD] = useState<string>("~/");
  const [output, setOutput] = useState<Output>(null);
  const { setTheme } = useTheme();

  async function run(input: string) {
    const [command, arg] = input.split(/\s+/);

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
        } else setOutput(null);
        break;
      }

      case "theme": {
        if (!arg) break;
        if (!isThemeName(arg)) break;
        else setTheme(arg);
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

  return { cwd, output, run };
}

export type TerminalState = ReturnType<typeof useTerminal>; // { cwd, output, run }
