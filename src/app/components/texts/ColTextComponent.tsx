"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const ColTextComponent = ({
  pretitle,
  title,
  subtitle,
  btnText,
  btnUrl = "/catalog",
  className,
}: {
  pretitle: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
  className?: string;
}) => {
  return (
    <div className={` ${className} p-20 maxmd:p-1 min-h-full min-w-full`}>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-xl text-blueDark maxsm:text-lg tracking-normal uppercase"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-5xl text-greenLight maxsm:text-2xl font-raleway font-black tracking-normal uppercase"
      >
        {title}{" "}
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-lg  maxmd:text-sm tracking-widest"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="py-10 maxmd:py-2"
      >
        <Link
          href={btnUrl}
          className="uppercase text-lg rounded-full py-3 maxmd:py-1 bg-blueDark drop-shadow-sm text-white duration-300"
        >
          {btnText}
        </Link>
      </motion.div>
    </div>
  );
};

export default ColTextComponent;
