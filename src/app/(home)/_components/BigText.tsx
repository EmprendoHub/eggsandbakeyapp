"use client";
import { motion } from "framer-motion";

const BigText = (): JSX.Element => {
  return (
    <section
      className="h-[100vh] maxsm:h-[60vh] flex flex-col justify-center items-center w-full overflow-hidden bg-[#dac340] text-[#000000]"
      id="start"
    >
      <div className="w-full py-20 text-left font-black uppercase leading-[.8] px-1">
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[30vw]"
        >
          WAKE
        </motion.div>
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="flex gap-[3vw] text-[12vw] maxmd:text-[11.5vw] maxmd:flex "
        >
          <span className="inline-block">YOUR </span>
          <span className="inline-block">DREAM</span>
          <span className="inline-block">AND </span>
        </motion.div>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[30vw] maxsm:w-[20vw]"
        >
          BRAND
        </motion.div>
      </div>
    </section>
  );
};

export default BigText;
