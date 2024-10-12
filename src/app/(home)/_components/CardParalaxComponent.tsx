"use client";
import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import styles from "./parallaxpage.module.scss";
import CardParalax from "./CardParalax";
import { projects } from "@/constants/projects";

export default function CardParalaxComponent() {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div ref={container} className={`${styles.main} `}>
      {projects.map((project, i) => {
        const targetScale = 1 - (projects.length - i) * 0.05;
        return (
          <CardParalax
            key={`p_${i}`}
            i={i}
            title={project.title}
            description={project.description}
            src={project.src}
            url={project.url}
            color={project.color}
            progress={scrollYProgress}
            range={[i * 0.25, 1]} // Adjust parallax range for each card
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}
