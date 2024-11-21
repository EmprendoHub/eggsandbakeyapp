"use client";
import React, { useEffect, useRef } from "react";
import { words } from "./data";
import "./loader.css";
import { introAnimation, collapseWords, progressAnimation } from "./animations";
// Assuming timeline is a GSAP timeline or similar type. Replace `any` with the actual type if known.
export type LoaderProps = {
  timeline: gsap.core.Timeline | null; // Replace with the correct type if it's not GSAP
};

const Loader: React.FC<LoaderProps> = ({ timeline }) => {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const progressNumberRef = useRef(null);
  const wordGroupsRef = useRef(null);

  useEffect(() => {
    timeline &&
      timeline
        .add(introAnimation(wordGroupsRef))
        .add(progressAnimation(progressRef, progressNumberRef), 0)
        .add(collapseWords(loaderRef), "-=1");
  }, [timeline]);

  return (
    <div className={`loader_wrapper overflow-hidden `}>
      <div className={`loader_progressWrapper`}>
        <div className={`loader_progress`} ref={progressRef}></div>
        <span className={`loader_progressNumber`} ref={progressNumberRef}>
          0
        </span>
      </div>
      <div className={`loader`} ref={loaderRef}>
        <div className={`loader_words`}>
          <div className={`loader_overlay`}></div>
          <div ref={wordGroupsRef} className={`loader_wordsGroup`}>
            {words.map((word: string, index: number) => {
              return (
                <span key={index} className={`loader_word`}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
