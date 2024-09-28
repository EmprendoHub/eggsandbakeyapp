"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import "./hero.css";
import { animateTitle, animateImage, revealMenu } from "./animations";

const Hero = () => {
  const timeline = useRef(gsap.timeline());
  const heroRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const tl = timeline.current;

      tl.add(animateTitle()).add(revealMenu(), 0).add(animateImage(), 0);
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section className={`hero`} ref={heroRef}>
      <h1 className={`hero_title flex flex-wrap gap-1`}>
        <span data-hidden data-title-first style={{ visibility: "hidden" }}>
          Agencia
        </span>
        <span data-hero-line className={`hero_line`}></span>
        <span data-hidden data-title-last style={{ visibility: "hidden" }}>
          Creativa
        </span>
      </h1>

      <div className={`hero_image`}>
        <div data-image-overlay className={`hero_imageOverlay`}></div>
        <Image
          data-image
          src="/logos/EggsandBakeyLOGO-BLANCO.webp"
          width={350}
          height={350}
          alt="Eggs & Bakey"
          className="w-auto h-auto"
        />
      </div>
    </section>
  );
};

export default Hero;
