"use client";
import React, { useRef, useContext, useState } from "react";
import { TransitionContext } from "@/context/TransitionContext";
import { motion } from "framer-motion";
import useMousePosition from "@/utils/useMousePosition";
import "../acerca/acerca.css";

const PageHeader = ({
  maskText,
  mainTextOne,
  mainTextSpan,
  mainTextTwo,
}: {
  maskText: string;
  mainTextOne: string;
  mainTextSpan: string;
  mainTextTwo: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;
  const context = useContext(TransitionContext);

  // Ensure timeline exists before using it
  if (!context) {
    console.log("context", context);

    throw new Error("Acerca must be used within a TransitionProvider");
  }

  const container = useRef<HTMLDivElement>(null);

  return (
    <div className={`main`} ref={container}>
      <motion.div
        className={`mask`}
        animate={{
          WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <p
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          {maskText}
        </p>
      </motion.div>

      <div className={`body`}>
        <p>
          {mainTextOne}
          <span> {mainTextSpan}</span>
          {mainTextTwo}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
