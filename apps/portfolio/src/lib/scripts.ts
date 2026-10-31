// One question the script asks
export type ScriptStep = {
  field: string; // where answer is saved, e.g. "subject"
  prompt: string;
};

// A whole script: its questions, plus what to do with the answers at the end
export type Script = {
  steps: ScriptStep[];
  onFinish: (answer: Record<string, string>) => string; // returns the final line to show
};

// create a 'script' below
export const scripts = {
  "contact.sh": {
    steps: [
      { field: "email", prompt: "Enter your email: " },
      { field: "subject", prompt: "Subject: " },
      { field: "message", prompt: "Message: " },
    ],
    onFinish: (answer) =>
      "Thanks! I'll look into your message and contact you soon.",
  },
} satisfies Record<string, Script>;

export type ScriptName = keyof typeof scripts; // "contact.sh"

export function isScript(value: string): value is ScriptName {
  return Object.hasOwn(scripts, value);
}
