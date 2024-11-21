"use client";
import { motion } from "framer-motion";

const BigText = (): JSX.Element => {
  return (
    <section
      className="h-[120vh] maxsm:h-[45vh] flex flex-col justify-center items-center w-full overflow-hidden bg-[#dac340] text-[#000000]"
      id="start"
    >
      <div className="w-full py-5 h-full text-left font-black uppercase leading-[.8] px-1">
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[25vw] maxsm:text-[32vw]"
        >
          WAKE
        </motion.div>
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="flex gap-[3vw] text-[10vw] maxmd:text-[11vw] maxmd:flex "
        >
          <span className="inline-block">YOUR </span>
          <span className="inline-block">DREAM</span>
          <span className="inline-block">AND </span>
        </motion.div>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-[25vw] maxsm:text-[28vw]"
        >
          BRAND
        </motion.div>
      </div>
    </section>
  );
};

export default BigText;
