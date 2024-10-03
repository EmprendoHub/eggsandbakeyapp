"use client";
import React, { useState } from "react";
import { proyectos } from "@/constants/proyectosdata";
import Image from "next/image";
import { motion } from "framer-motion";
import ExpandableImage from "../_components/ExpandableImage";

const ProyectoSingle = ({ params }: { params: { id: number } }) => {
  const projectId = Number(params.id);

  // Track the index of the currently expanded image
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    // If the same image is clicked, collapse it; otherwise, expand it
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="h-auto flex-col flex justify-center items-center w-full">
      <motion.div
        initial={{ y: -180, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="flex justify-center items-center bg-[#dac340] h-60 w-full text-black text-4xl"
      >
        {proyectos[projectId].name}
      </motion.div>
      <motion.div
        initial={{ y: 180, opacity: 0.5 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="relative w-full flex items-center justify-center"
      >
        <Image
          width={850}
          height={850}
          src={proyectos[projectId].cover}
          alt={proyectos[projectId].name}
          className="-mt-14 rounded-[12px] w-[90%]"
        />
      </motion.div>
      <div className="flex flex-col w-[75%] mt-10">
        <motion.p
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
        >
          {proyectos[projectId].name}
        </motion.p>
        {proyectos[projectId].paragraphs.map((par, index) => (
          <motion.p
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1 * (index + 1) }}
            key={index + 10}
            className="text-sm tracking-wide my-2"
          >
            {par}
          </motion.p>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center w-[75%] mt-10 gap-3">
        {proyectos[projectId].images.map((image, index) => (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            key={index + 100}
            className="w-[45%]"
          >
            <ExpandableImage
              width={450}
              height={450}
              src={image}
              alt={proyectos[projectId].name}
              isExpanded={expandedIndex === index}
              onClick={() => handleImageClick(index)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProyectoSingle;
