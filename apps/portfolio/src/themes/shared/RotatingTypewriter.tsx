"use client";

import { useEffect, useState } from "react";

export type RotatingTypewriterVariant =
  | "normal"
  | "mute"
  | "bold"
  | "underline"
  | "highlight";

export type RotatingTypewriterPhrase = {
  text: string;
  variant?: RotatingTypewriterVariant;
  className?: string;
};

type RotatingTypewriterProps = {
  phrases: RotatingTypewriterPhrase[];
  startDelay?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
};

export default function RotatingTypewriter({
  phrases,
  startDelay = 0,
  typeSpeed = 75,
  deleteSpeed = 40,
  pause = 1500,
}: RotatingTypewriterProps) {
  const [started, setStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = phrases[phraseIndex];
  const displayedText = phrase.text.slice(0, characterIndex);

  useEffect(() => {
    if (!phrase) return;

    let delay = deleting ? deleteSpeed : typeSpeed;

    // Finished typing
    if (!deleting && characterIndex === phrase.text.length) {
      delay = pause;
    }

    if (!started) delay = startDelay;

    const timeout = setTimeout(() => {
      if (!started) {
        setStarted(true);
        return;
      }

      // Start deleting after pause
      if (!deleting && characterIndex === phrase.text.length) {
        setDeleting(true);
        return;
      }

      // Move to next phrase
      if (deleting && characterIndex === 0) {
        setDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }

      setCharacterIndex((current) => (deleting ? current - 1 : current + 1));
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    started,
    startDelay,
    characterIndex,
    deleting,
    phrase,
    phrases.length,
    typeSpeed,
    deleteSpeed,
    pause,
  ]);

  return (
    <span className={getVariantClass(phrase.variant)}>
      {/* Screen readers: every phrase, once, never changing */}
      <span className="sr-only">{phrases.map((p) => p.text).join(", ")}</span>

      {/* What sighted users see, laid over the reserved space */}
      <span aria-hidden="true" className={`${phrase.className ?? ""}`}>
        {displayedText}
        <span className="cursor-blink border-l-[0.1rem]" />
      </span>
    </span>
  );
}

function getVariantClass(variant: RotatingTypewriterVariant = "normal") {
  switch (variant) {
    case "mute":
      return "text-header-muted";

    case "bold":
      return "font-semibold";

    case "underline":
      return "underline";

    case "highlight":
      return "bg-highlight";

    default:
      return "";
  }
}
