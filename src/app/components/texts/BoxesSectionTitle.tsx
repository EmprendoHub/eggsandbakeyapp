"use client";
import { motion } from "framer-motion";

const BoxesSectionTitle = ({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div className={`${className} `}>
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=" mb-2 text-7xl maxlg:text-5xl maxmd:text-4xl font-black uppercase text-foreground font-EB_Garamond"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-base pb-3 text-stone-800"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default BoxesSectionTitle;
