"use client";
import { motion } from "framer-motion";
import "./hero.css";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const Hero = ({ shouldPlay }: { shouldPlay: boolean }) => {
  // Pulsating animation for the ChevronDown
  const chevronVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="hero overflow-hidden flex flex-col justify-center items-center bg-[#0e0f0e]">
      <div className="flex mt-20 items-center justify-center h-full w-full">
        <video
          width="100%"
          height="100%"
          controls={false}
          autoPlay={shouldPlay} // Only play when loader finishes
          muted={true}
          playsInline={true}
        >
          <source src="/videos/EggsBakeyIntro.mp4" type="video/mp4" />
        </video>
      </div>
      <Link href={"#start"} className="absolute z-30 bottom-0">
        <motion.div variants={chevronVariants} animate="pulse">
          <ChevronDown size={100} />
        </motion.div>
      </Link>
    </section>
  );
};

export default Hero;
