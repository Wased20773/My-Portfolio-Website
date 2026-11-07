import { createHash } from "node:crypto";

// Server-only code: this file never ships to the browser, so it can safely
// read secret env vars. Its folder path makes it answer POST /api/contact.

// Max length of each field contact.sh sends
const LIMITS = {
  email: 254, // longest valid email address
  subject: 150,
  message: 5000,
};

// Loose check: something@something.something (with no spaces)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

// Browsers send an Origin header ("https://yoursite.com") with every fetch POST.
// Only accept requests coming from a page on this same site. curl can fake
// this header, so it's a speed bump against other websites, not a lock.
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host"); // the domain this server is answering on
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false; // Origin header wasn't a valid URL
  }
}

export async function POST(request: Request) {
  // 0. Make sure the server is set up. Without these the send would fail in a
  //    confusing way ("Bearer undefined"), so fail early with a clear log
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL in env");
    return error("Couldn't send your message. Try again later.", 500);
  }

  if (!isSameOrigin(request)) {
    return error("Forbidden.", 403);
  }

  // 1. Read the body. A bad/missing JSON body throws, so catch it
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request.", 400);
  }

  // 2. Validate. Anyone can call this URL directly, not just contact.sh
  const fields = body as Record<string, unknown>;
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = fields?.[field];
    if (typeof value !== "string" || value.trim() === "") {
      return error(`Missing ${field}.`, 400);
    }
    if (value.length > max) {
      return error(`${field} is too long (max ${max} characters).`, 400);
    }
  }

  const email = (fields.email as string).trim();
  // The subject becomes an email header, and headers are separated by line
  // breaks, so a "\r\n" in it could sneak in extra headers. Flatten it to one line.
  // (email can't contain whitespace at all, EMAIL_PATTERN rejects it)
  const subject = (fields.subject as string).replace(/[\r\n\t]+/g, " ").trim();
  // The message is the body, not a header, so line breaks are safe there
  const message = (fields.message as string).trim();

  if (!EMAIL_PATTERN.test(email)) {
    return error(
      "That email doesn't look right. Please type in a correctly formatted email.",
      400,
    );
  }

  // 3. Build the email we're about to send
  const payload = JSON.stringify({
    // Must be an address you're allowed to send from; onboarding@resend.dev
    // works until you verify your own domain in Resend
    from: "Portfolio <onboarding@resend.dev>",
    to: toEmail, // kept in .env.local so it isn't public on GitHub
    reply_to: email, // pressing "Reply" answers the visitor
    subject: `[Portfolio] ${subject}`,
    text: `From: ${email}\n\n${message}`,
  });

  // Idempotency key = fingerprint of the email itself. Sending the exact same
  // email again gives the exact same key, so for 24 hours Resend answers with
  // the original success instead of sending a duplicate. Change one character
  // and the key changes, so it counts as a new email.
  const idempotencyKey = createHash("sha256").update(payload).digest("hex");

  // 4. Send it through Resend's HTTP API using the secret key
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: payload,
  });

  // 409 = this same email is still being sent by an earlier request
  if (res.status === 409) {
    return error(
      "That message is already being sent. Give it a moment before trying again.",
      409,
    );
  }

  // 5. Report back. The real reason goes to the server log, not the visitor
  if (!res.ok) {
    console.error("Resend failed:", res.status, await res.text());
    return error("Couldn't send your message. Try again later.", 500);
  }

  return Response.json({ ok: true });
}
