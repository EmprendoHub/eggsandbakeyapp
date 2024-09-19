"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

import "./hero.css";
import { animateTitle, animateImage, revealMenu } from "./animations";

import Logo from "../LogoLoader/Logo";

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
      <div className={`hero_top`}>
        <div data-menu-item data-hidden>
          <Logo />
        </div>
      </div>

      <h1 className={`hero_title flex flex-wrap`}>
        <span data-hidden>Ultra</span>
        <span data-hidden>agencia</span>
      </h1>

      <div className={`hero_image`}>
        <div data-image-overlay className={`hero_imageOverlay`}></div>
        <Image
          data-image
          src="/logos/LOGO-BLANCO.webp"
          width={550}
          height={550}
          alt="Blob"
        />
      </div>
    </section>
  );
};

export default Hero;
