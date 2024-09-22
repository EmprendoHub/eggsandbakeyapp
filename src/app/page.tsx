"use client";
import dynamic from "next/dynamic";
import { ReactLenis } from "lenis/react";
import { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import Hero from "./components/HeroLoader/Hero";
import Loader from "./components/Loader/Loader";
import Marquee from "./components/marquees/Marquee";
import TestimonialComponent from "./(home)/_components/TestimonialComponent";

const CardsExpanding = dynamic(
  () => import("./(home)/_components/CardsExpanding"),
  {
    ssr: false,
  }
);

const CardsSplit = dynamic(() => import("./(home)/_components/CardsSplit"), {
  ssr: false,
});

export default function Home() {
  const [loaderFinished, setLoaderFinished] = useState(false);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setLoaderFinished(true),
      });
      setTimeline(tl);
    });

    return () => context.revert();
  }, []);

  return (
    <>
      <ReactLenis
        root
        options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
      >
        <div className="h-[100vh]">
          {loaderFinished ? <Hero /> : <Loader timeline={timeline} />}
        </div>
        <CardsSplit />
        <Marquee />
        <TestimonialComponent />

        <CardsExpanding />
      </ReactLenis>
    </>
  );
}
