"use client";
import { useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import Loader from "./components/Loader/Loader";
import Marquee from "./components/marquees/Marquee";
import TestimonialComponent from "./(home)/_components/TestimonialComponent";
import { TextSplitter } from "./(home)/_components/TextSplitter";
import CardParalaxComponent from "./(home)/_components/CardParalaxComponent";
import BigText from "./(home)/_components/BigText";
import FooterComponent from "./components/footer/FooterComponent";
import dynamic from "next/dynamic";
import StoriesComponent from "./(home)/_components/StoriesComponent";

const Hero = dynamic(() => import("./components/HeroLoader/Hero"), {
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
    <div className="relative">
      <div className="h-[100vh]">
        {/* Start preloading the video immediately, but it will only play once the loader is finished */}
        <Hero shouldPlay={loaderFinished} />
        {!loaderFinished && <Loader timeline={timeline} />}
      </div>

      {loaderFinished && <BigText />}

      {loaderFinished && <Marquee />}
      {loaderFinished && <TestimonialComponent />}
      {loaderFinished && <CardParalaxComponent />}
      {loaderFinished && <StoriesComponent />}
      {loaderFinished && (
        <section className="flex flex-wrap bg-[#dac340] text-[#c9c9c9] font-black py-20 px-2 leading-[0.8] overflow-hidden">
          <TextSplitter text="WAKE UP YOUR BRAND" />
        </section>
      )}
      {loaderFinished && <FooterComponent />}
    </div>
  );
}
