"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const SectionTextColorComponent = ({
  pretitle,
  title,
  subtitle,
  btnText,
  btnUrl = "/servicios",
}: {
  pretitle: string;
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
}) => {
  return (
    <div className="text-center">
      <motion.p
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="text-base sm:text-sm tracking-wide uppercase"
      >
        {pretitle}
      </motion.p>
      <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8 }}
        className="text-6xl maxmd:text-4xl font-raleway font-black tracking-normal uppercase"
      >
        {title}{" "}
      </motion.h2>
      <motion.p
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-base maxmd:text-sm pt-3 tracking-wide "
      >
        {subtitle}
      </motion.p>
      {btnText && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="py-5"
        >
          <Link
            href={btnUrl}
            className="pt-3 uppercase text-lg rounded-full px-6 py-3 bg-greenLight drop-shadow-sm text-white duration-300"
          >
            {btnText}
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default SectionTextColorComponent;
