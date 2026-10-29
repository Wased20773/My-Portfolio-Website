"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

type TypewriterProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

function getTextLength(node: ReactNode): number {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).length;
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextLength(node.props.children);
  }

  if (Array.isArray(node)) {
    return node.reduce((total, child) => total + getTextLength(child), 0);
  }

  return 0;
}

function reveal(node: ReactNode, characters: number): ReactNode {
  if (characters <= 0) return null;

  if (typeof node === "string" || typeof node === "number") {
    return String(node).slice(0, characters);
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, {}, reveal(node.props.children, characters));
  }

  if (Array.isArray(node)) {
    let remaining = characters;

    return Children.map(node, (child) => {
      const length = getTextLength(child);

      if (remaining <= 0) return null;

      const result = reveal(child, remaining);
      remaining -= length;

      return result;
    });
  }

  return null;
}

export default function Typewriter({
  children,
  className,
  speed = 50,
}: TypewriterProps) {
  const totalCharacters = useMemo(() => getTextLength(children), [children]);
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= totalCharacters) {
          clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [totalCharacters, speed]);

  return (
    <p className={`${className} relative`}>
      {/* Screen reader version */}
      <span className="sr-only">{children}</span>

      {/* Holds the final size so nothing below moves */}
      <span aria-hidden="true" className="invisible">
        {children}
      </span>

      {/* Visual animated version */}
      <span aria-hidden="true" className="absolute inset-0">
        {reveal(children, visibleCharacters)}
        <span className="cursor-blink border-l-[0.1rem]"></span>
      </span>
    </p>
  );
}
