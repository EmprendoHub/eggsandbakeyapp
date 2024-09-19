"use client";
import React, { useRef, useContext } from "react";
import Picture from "../../../../public/images/blob.jpg";
import Image from "next/image";
import { TransitionContext } from "@/context/TransitionContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Trabajos = () => {
  const context = useContext(TransitionContext);

  // Ensure timeline exists before using it
  if (!context) {
    console.log("context", context);

    throw new Error("Trabajos must be used within a TransitionProvider");
  }

  const { timeline } = context;
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray(["p", image.current]);
      gsap.fromTo(
        targets,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 1 }
      );
      timeline.add(gsap.to(container.current, { opacity: 0 }));
    },
    { scope: container }
  );

  return (
    <div className="page">
      <div ref={container} className="h-[100vh] flex">
        <div className="h-[100vh] w-full flex flex-col justify-center items-center gap-5">
          <p className="text-[5vw]">Trabajos</p>
          <p className="max-w-[50%] text-center">
            Sed ut rhoncus nibh. Cras eleifend tellus a enim sodales, a
            efficitur odio euismod. Aenean non consequat lectus. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Fusce quis
            eleifend ipsum, sit amet posuere ligula.
          </p>
          <div ref={image} className="relative w-[50%] h-[40vh]">
            <Image
              alt="blur"
              src={Picture}
              placeholder="blur"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trabajos;
