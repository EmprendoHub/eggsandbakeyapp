"use client";
import { motion } from "framer-motion";

const HeroColTextComponent = ({
  pretitle,
  title,
  word,
  subtitle,
  className,
}: {
  pretitle: string;
  title: string;
  word: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div className={`${className}  `}>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="text-[12px] uppercase pb-2 tracking-widest"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-8xl maxmd:text-4xl font-EB_Garamond uppercase font-bold tracking-normal"
      >
        {title} <span className=" text-greenLight font-black ">{word} </span>
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="text-lg maxmd:text-sm pt-3 tracking-widest font-ubuntu"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default HeroColTextComponent;
