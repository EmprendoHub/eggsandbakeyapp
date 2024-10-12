"use client";
import { motion } from "framer-motion";
import "./hero.css";
import ReactPlayer from "react-player";

const Hero = () => {
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <section className="hero overflow-hidden">
      <motion.div
        className="flex mt-20 items-center justify-center h-full w-full"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
      >
        <ReactPlayer
          url="/videos/Reel_Letras_Grunge_Pagina_Eggs.webm"
          width="100%"
          height="100%"
          controls={false}
          playing={true}
          muted={true} // Add this line
        />
      </motion.div>
    </section>
  );
};

export default Hero;
