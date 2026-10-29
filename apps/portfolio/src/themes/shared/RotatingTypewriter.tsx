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
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
};

export default function RotatingTypewriter({
  phrases,
  typeSpeed = 75,
  deleteSpeed = 40,
  pause = 1500,
}: RotatingTypewriterProps) {
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

    const timeout = setTimeout(() => {
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
    characterIndex,
    deleting,
    phrase,
    phrases.length,
    typeSpeed,
    deleteSpeed,
    pause,
  ]);

  return (
    <span className={`${phrase.className} ${getVariantClass(phrase.variant)}`}>
      {displayedText}
      <span className="cursor-blink border-l-[0.1rem]"></span>
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
