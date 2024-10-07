"use client";
import React from "react";
import PixelTransition from "@/app/components/transitions/PixelTransition";
import CardsExpanding from "../_components/CardsExpanding";
import BigText from "../_components/BigText";

const Proyectos = () => {
  return (
    <div className="min-h-[100vh]">
      <BigText />
      <PixelTransition />
      <CardsExpanding />
    </div>
  );
};

export default Proyectos;
