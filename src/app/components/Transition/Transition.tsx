import React, { useState, useContext, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TransitionContext } from "../../../context/TransitionContext"; // Adjust the import path
gsap.registerPlugin(useGSAP);

interface TransitionLayoutProps {
  children: React.ReactNode;
}

export default function TransitionLayout({ children }: TransitionLayoutProps) {
  const [displayChildren, setDisplayChildren] = useState(children);

  // Get the timeline and setTimeline from the context, with proper error handling
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error(
      "TransitionLayout must be used within a TransitionProvider"
    );
  }

  const { timeline } = context;

  const { contextSafe } = useGSAP();

  const exit = contextSafe(() => {
    timeline.play().then(() => {
      window.scrollTo(0, 0);
      setDisplayChildren(children);
      timeline.pause().clear();
    });
  });

  useEffect(() => {
    // Check if the page is not the current page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((children as any).key !== (displayChildren as any).key) {
      exit();
    }
  }, [children]);

  return <div className="bg-white">{displayChildren}</div>;
}
