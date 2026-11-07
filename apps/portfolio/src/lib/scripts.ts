// One question the script asks
export type ScriptStep = {
  field: string; // where answer is saved, e.g. "subject"
  prompt: string;
};

// A whole script: its questions, plus what to do with the answers at the end
export type Script = {
  steps: ScriptStep[];
  onFinish: (answer: Record<string, string>) => Promise<string>; // returns the final line to show
};

// create a 'script' below
export const scripts = {
  "contact.sh": {
    steps: [
      { field: "email", prompt: "Enter your email: " },
      { field: "subject", prompt: "Subject: " },
      { field: "message", prompt: "Message: " },
    ],
    onFinish: async (answers) => {
      try {
        // Hand the saved answers ({ email, subject, message }) to the server route
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });

        if (res.ok) {
          return "Sent! Thanks, I'll look into your message and contact you soon.";
        }

        // The route replies { error: "..." } when validation or sending fails
        const data = await res.json().catch(() => ({}));
        return `Error: ${data.error ?? "Couldn't send your message."} Run ./contact.sh to try again.`;
      } catch {
        // fetch itself failed (offline, server down...)
        return "Error: Couldn't reach the server. Check your connection and try again.";
      }
    },
  },
} satisfies Record<string, Script>;

export type ScriptName = keyof typeof scripts; // "contact.sh"

export function isScript(value: string): value is ScriptName {
  return Object.hasOwn(scripts, value);
}
