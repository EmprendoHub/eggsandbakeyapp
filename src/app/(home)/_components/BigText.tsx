"use client";
import { motion } from "framer-motion";

const BigText = (): JSX.Element => {
  return (
    <section className="h-auto w-screen overflow-hidden bg-[#dac340] text-[#000000]">
      <div className="w-full py-20 text-left font-black uppercase leading-[.8] px-1">
        <motion.div
          initial={{ y: -180, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[34vw] maxmd:text-[32vw]"
        >
          WAKE
        </motion.div>
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="grid gap-[3vw] text-[34vw] maxmd:text-[11.5vw] maxmd:flex "
        >
          <span className="inline-block">YOUR </span>
          <span className="inline-block max-md:text-[27vw]">DREAM</span>
          <span className="inline-block max-md:text-[38vw]">AND </span>
        </motion.div>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[30vw]"
        >
          BRAND
        </motion.div>
      </div>
    </section>
  );
};

export default BigText;
