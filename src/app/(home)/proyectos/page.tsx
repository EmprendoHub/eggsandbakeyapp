"use client";
import React from "react";
import PixelTransition from "@/app/components/transitions/PixelTransition";
import BigText from "../_components/BigText";
import CardParalaxComponent from "../_components/CardParalaxComponent";
import FooterComponent from "@/app/components/footer/FooterComponent";

const Proyectos = () => {
  return (
    <div className="relative">
      <PixelTransition />
      <BigText />

      <CardParalaxComponent />
      <FooterComponent />
    </div>
  );
};

export default Proyectos;
