"use client";
import React from "react";
import MarqueeItem from "./MarqueeItem";
import { motion } from "framer-motion";

const Marquee = () => {
  const upperMarquee = [
    "/logos/24.png",
    "/logos/alucrisa.png",
    "/logos/amecas.png",
    "/logos/BMW.png",
    "/logos/cienega.png",
    "/logos/claudia.png",
    "/logos/cochera.png",
  ];

  const lowerMarquee = [
    "/logos/gina.png",
    "/logos/hopsital.png",
    "/logos/paco.png",
    "/logos/portada.png",
    "/logos/portadaA.png",
    "/logos/rodrigo.png",
    "/logos/TERE.png",
    "/logos/tohui.png",
  ];

  return (
    <div className="overflow-hidden mt-20">
      <motion.h2
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pl-5 maxmd:pl-2 font-bold text-6xl tracking-wider uppercase"
      >
        Clientes
      </motion.h2>
      <motion.p
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="pl-8 maxmd:pl-3 pb-10 text-xs "
      >
        Nos enorgullese saber que pudimos ayudar a cada uno nuestros clientes.
      </motion.p>

      <div className="container mx-auto h-60">
        <MarqueeItem images={upperMarquee} from={"0"} to={"-100%"} />
        <MarqueeItem images={lowerMarquee} from={"-100%"} to={"0"} />
      </div>
    </div>
  );
};

export default Marquee;
