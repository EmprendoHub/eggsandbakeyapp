"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const SectionTextComponent = ({
  title,
  paraOne,
  paraTwo = "",
  btnText = "Catalog",
  btnUrl = "/catalog",
}: {
  title: string;
  paraOne: string;
  paraTwo: string;
  btnText: string;
  btnUrl: string;
}) => {
  return (
    <div className="mx-auto">
      <div className="flex h-full flex-col gap-y-6 justify-center">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond uppercase tracking-widest "
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-sm font-poppins text-slate-300"
        >
          {paraOne}
        </motion.p>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="text-sm font-poppins text-slate-300"
        >
          {paraTwo}
        </motion.p>
        {/* button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="flex gap-x-4 mt-2 justify-center"
        >
          <Link href={btnUrl}>
            <p className="py-3 px-8 rounded-full bg-[#dac340] text-black hover:scale-110  duration-700 text-sm uppercase font-semibold w-full">
              {btnText}
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionTextComponent;
