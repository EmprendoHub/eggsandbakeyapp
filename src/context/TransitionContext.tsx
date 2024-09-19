"use client";
import React, { useState, createContext, ReactNode } from "react";
import gsap from "gsap";

// Define the type of the context value
interface TransitionContextType {
  timeline: gsap.core.Timeline;
  setTimeline: React.Dispatch<React.SetStateAction<gsap.core.Timeline>>;
}

// Create the context with an empty default value (we'll fix this shortly)
const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

interface TransitionProviderProps {
  children: ReactNode;
}

const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const [timeline, setTimeline] = useState(() =>
    gsap.timeline({ paused: true })
  );

  return (
    <TransitionContext.Provider value={{ timeline, setTimeline }}>
      {children}
    </TransitionContext.Provider>
  );
};

export { TransitionContext, TransitionProvider };
