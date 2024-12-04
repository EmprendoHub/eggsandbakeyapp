"use client";
import { projects } from "@/constants/projects";
import WorkCard from "./WorkCard";
import { motion } from "framer-motion";

export default function WorkBoxes() {
  return (
    <div className="w-full mx-auto px-20 maxmd:px-5">
      <motion.h2
        initial={{ y: -80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pl-20 maxmd:pl-2 font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
      >
        Casos de Éxito
      </motion.h2>
      <motion.p
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="pl-20 maxmd:pl-3 pb-10 text-sm "
      >
        Proyectos destacados
      </motion.p>
      <div className="flex flex-wrap gap-4 items-center justify-center relative ">
        {projects.map((project, i) => {
          return (
            <motion.div
              key={`p_${i}`}
              initial={{ y: -80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 + i / 100 }}
              className=" font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
            >
              <WorkCard src={project.src} url={project.url} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
