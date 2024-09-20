"use client";
import { motion } from "framer-motion";

const SectionTitle = ({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => {
  return (
    <div
      className={`section-title-class w-[60%] maxmd:w-[90%] flex flex-col items-center justify-center  mx-auto ${className} `}
    >
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="  font-EB_Garamond mb-4"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-[1px] w-[150px] border-b border-black mb-4"
      />
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-base sm:text-sm font-raleway font-bold"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionTitle;
