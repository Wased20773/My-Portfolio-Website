export const commands = {
  ls: {
    usage: "ls",
    description: "List folders and files",
    details:
      "Shows everything inside a folder: its sub-folders and the files you can open " +
      "with `cat`. On its own, `ls` lists the folder you're in. Give it a path to peek " +
      "inside another folder without leaving the one you're in. Depending on the type of ",
    info: [
      { usage: "ls", description: "List the current folder" },
      { usage: "ls [folder]", description: "List a folder inside this one" },
      { usage: "ls ..", description: "List the parent folder" },
      { usage: "ls ~", description: "List the home folder" },
      {
        usage: "ls ~/projects/personal",
        description: "List any folder by its full path",
      },
    ],
  },
  cd: {
    usage: "cd [folder]",
    description: "Move into a folder",
    details:
      "Changes the folder you're in. Paths can be relative " +
      "to where you are, where .. means the folder above, or start from home with ~. " +
      "Running cd on its own takes you back home.",
    info: [
      { usage: "cd", description: "Go back home" },
      { usage: "cd ~", description: "Go back home" },
      { usage: "cd ..", description: "Go up to the parent folder" },
      {
        usage: "cd [folder]",
        description: "Move into a folder inside this one",
      },
      {
        usage: "cd ../[folder]",
        description: "Go up, then into another folder",
      },
      {
        usage: "cd ~/[folder]",
        description: "Jump to a folder from home",
      },
      {
        usage: "cd [folder_1]/.../[folder_n]",
        description: "Move several folders deep",
      },
    ],
  },
  cat: {
    usage: "cat [file]",
    description: "Open a file",
    details:
      "Opens a file and shows its full content, like my about me, a project, or a " +
      "post. It only works on files, so use `ls` first to see which ones a folder has. " +
      "The file name + extesion will always be present when performing `ls`. " +
      "Files can be opened from anywhere using the same paths as `cd`.",
    info: [
      { usage: "cat [file]", description: "Open a file in this folder" },
      {
        usage: "cat [folder]/[file]",
        description: "Open a file inside another folder",
      },
      {
        usage: "cat ../[file]",
        description: "Open a file in the parent folder",
      },
      {
        usage: "cat ~/[folder]/[file]",
        description: "Open a file by its full path",
      },
    ],
  },
  clear: {
    usage: "clear",
    description: "Clear the output",
    details:
      "Empties the output screen so you can start fresh. You stay in the same " +
      "folder; only what's displayed is removed. " +
      "When any command is performed, it automatically performs a `clear`",
    info: [{ usage: "clear", description: "Empty the output screen" }],
  },
  // theme: {
  //   usage: "theme [name]",
  //   description: "Change the site's theme",
  //   details:
  //     "Restyles the whole site, from colors to layout. Your current folder and " +
  //     "output stay the same, only the look changes.",
  //   info: [
  //     {
  //       usage: "theme default",
  //       description: "Switch back to the default theme",
  //     },
  //   ],
  // },
  help: {
    usage: "help [command]",
    description: "Show all commands, or one",
    details:
      "On its own, help lists every command with a short summary. Add a command's " +
      "name to see a full explanation and every way to use it as well as some extra info " +
      "about the command",
    info: [
      { usage: "help", description: "List every available command" },
      {
        usage: "help [command]",
        description: "Show ways to use a command",
      },
    ],
  },
} as const;

export type CommandTypes = keyof typeof commands;

export function isCommand(value: string): value is CommandTypes {
  return Object.hasOwn(commands, value);
}

export function withCode(text: string) {
  return text
    .split("`")
    .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}
