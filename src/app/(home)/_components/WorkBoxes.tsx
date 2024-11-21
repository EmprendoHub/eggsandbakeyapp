"use client";
import { projects } from "@/constants/projects";
import WorkCard from "./WorkCard";
import { motion } from "framer-motion";

export default function WorkBoxes() {
  return (
    <div className="w-[80%] maxmd:w-[95%] mx-auto">
      <motion.h2
        initial={{ y: -80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pl-10 maxmd:pl-5 mb-10 font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
      >
        Casos de Éxito
      </motion.h2>
      <div className="flex flex-wrap gap-4 items-center justify-center relative ">
        {projects.map((project, i) => {
          return (
            <motion.div
              key={`p_${i}`}
              initial={{ y: -80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="pl-10 mb-10 font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
            >
              <WorkCard src={project.src} url={project.url} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
