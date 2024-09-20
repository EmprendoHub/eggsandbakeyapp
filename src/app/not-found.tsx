"use client";
import React from "react";
import { motion } from "framer-motion";

const page = () => {
  return (
    <section className="relative min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center  bg-[#dac340] text-black">
      <div className="relative container mx-auto flex justify-center items-center text-center p-5 sm:py-20 z-10">
        <div className={`words`}>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1 }}
            className="text-[12px] uppercase pb-2 tracking-widest"
          >
            error
          </motion.p>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-[100px] maxmd:text-[100px] font-EB_Garamond uppercase font-bold tracking-normal"
          >
            404
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3 }}
            className="text-lg maxmd:text-sm pt-3 tracking-wide font-ubuntu"
          >
            Esta pagina no existe en nuestro sitio.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default page;
