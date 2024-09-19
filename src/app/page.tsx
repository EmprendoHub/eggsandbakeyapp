"use client";
import dynamic from "next/dynamic";
import { ReactLenis } from "lenis/react";

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
  return (
    <>
      <ReactLenis
        root
        options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
      >
        <CardsSplit />
        <CardsExpanding />
      </ReactLenis>
    </>
  );
}
