"use client";
import React, { useEffect, useState } from "react";
import "./pixels.css";
import { motion } from "framer-motion";

type Anim = {
  initial: { opacity: number };
  open: (delay: number[]) => {
    opacity: number;
    transition: { duration: number; delay: number };
  };
  closed: (delay: number[]) => {
    opacity: number;
    transition: { duration: number; delay: number };
  };
};

const anim: Anim = {
  initial: {
    opacity: 1,
  },
  open: (delay) => ({
    opacity: 0,
    transition: { duration: 0, delay: 0.07 * delay[1] },
  }),
  closed: (delay) => ({
    opacity: 0,
    transition: { duration: 0, delay: 0.07 * delay[0] },
  }),
};

export default function PixelTransition(): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  /**
   * Shuffles array in place (Fisher–Yates shuffle).
   * param {Array} a items An array containing the items.
   */
  const shuffle = <T,>(a: T[]): T[] => {
    let j: number, x: T, i: number;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };

  const getBlocks = (indexOfColum: number): JSX.Element[] => {
    if (!isClient) return [];

    const { innerWidth, innerHeight } = window;
    const blockSize = innerHeight * 0.1;
    const nbOfBlocks = Math.ceil(innerWidth / blockSize);
    const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i));
    return shuffledIndexes.map((randomIndex, index) => {
      return (
        <motion.div
          key={index}
          className={`block`}
          variants={anim}
          initial="initial"
          animate={"open"}
          custom={[indexOfColum + randomIndex, 10 - indexOfColum + randomIndex]}
        />
      );
    });
  };

  return (
    <div style={{ flexDirection: "column" }} className={`pixelBackground`}>
      {[...Array(10)].map((_, index) => {
        return (
          <div key={index} className={`row`}>
            {getBlocks(index)}
          </div>
        );
      })}
    </div>
  );
}
