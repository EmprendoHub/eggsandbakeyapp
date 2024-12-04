"use client";
import React from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";

const StoriesComponent = () => {
  return (
    <div className="flex flex-col my-40 px-20 maxmd:px-5">
      <motion.h2
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pl-20 maxmd:pl-2 font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
      >
        Estrategias Creativas
      </motion.h2>
      <motion.p
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.3 }}
        className="pl-20 maxmd:pl-3 pb-10 text-sm "
      >
        7 años creando Campañas Personalizadas
      </motion.p>
      <div className="flex gap-5 justify-center items-center  px-40 maxlg:px-20 maxmd:px-5">
        <div className="flex maxsm:flex-col gap-5 justify-center items-center">
          <ReactPlayer
            url="/videos/gif1.mp4"
            width="100%"
            height="100%"
            controls={false}
            playing={true} // Only play when loader finishes
            muted={true}
            preload="auto" // Preload the video
            loop={true}
            playsInline={true}
            disableRemotePlayback={true}
            style={{ borderRadius: "40px", overflow: "hidden" }}
          />
          <ReactPlayer
            url="/videos/gif2.mp4"
            width="100%"
            height="100%"
            controls={false}
            playing={true} // Only play when loader finishes
            muted={true}
            preload="auto" // Preload the video
            loop={true}
            playsInline={true}
            disableRemotePlayback={true}
            style={{ borderRadius: "40px", overflow: "hidden" }}
          />
        </div>
        <div className="flex maxsm:flex-col gap-5 justify-center items-center">
          <ReactPlayer
            url="/videos/gif3.mp4"
            width="100%"
            height="100%"
            controls={false}
            playing={true} // Only play when loader finishes
            muted={true}
            preload="auto" // Preload the video
            loop={true}
            playsInline={true}
            disableRemotePlayback={true}
            style={{ borderRadius: "40px", overflow: "hidden" }}
          />
          <ReactPlayer
            url="/videos/gif4.mp4"
            width="100%"
            height="100%"
            controls={false}
            playing={true} // Only play when loader finishes
            muted={true}
            preload="auto" // Preload the video
            loop={true}
            playsInline={true}
            disableRemotePlayback={true}
            style={{ borderRadius: "40px", overflow: "hidden" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StoriesComponent;
