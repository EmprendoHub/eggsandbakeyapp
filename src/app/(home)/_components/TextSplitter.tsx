"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  text: string;
  className?: string;
  wordDisplayStyle?: "inline-block" | "block";
};

export function TextSplitter({
  text,
  className,
  wordDisplayStyle = "inline-block",
}: Props) {
  if (!text) return null;

  const words = text.split(" ");

  return words.map((word: string, wordIndex: number) => {
    const splitText = word.split("");
    return (
      <span
        className={clsx("split-word uppercase px-1", className)}
        style={{ display: wordDisplayStyle, whiteSpace: "pre" }}
        key={`${wordIndex}-${word}`}
      >
        {splitText.map((char, charIndex) => {
          if (char === " ") return ` `;
          return (
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: wordIndex * 0.2 + charIndex * 0.05,
              }}
              key={charIndex}
              className={`split-char inline-block split-char--${wordIndex}-${charIndex} text-[20vw] maxsm:text-[30vw] text-black`}
            >
              {char}
            </motion.span>
          );
        })}
        {wordIndex < words.length - 1 ? (
          <span className="split-char">{` `}</span>
        ) : (
          ""
        )}
      </span>
    );
  });
}
