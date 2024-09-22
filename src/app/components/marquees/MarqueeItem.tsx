"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MarqueeItem = ({
  images,
  from,
  to,
}: {
  images: string[];
  from: string;
  to: string;
}) => {
  return (
    <div className="flex py-2">
      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0"
      >
        {images.map((image, index) => {
          return (
            <Image
              alt=""
              width={500}
              height={500}
              className="h-12 w-auto pr-20"
              src={image}
              key={index}
            />
          );
        })}
      </motion.div>

      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0"
      >
        {images.map((image, index) => {
          return (
            <Image
              alt=""
              width={500}
              height={500}
              className="h-12 w-auto pr-20"
              src={image}
              key={index}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default MarqueeItem;
