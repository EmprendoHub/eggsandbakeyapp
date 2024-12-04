"use client";
import React from "react";
import BigText from "../_components/BigText";
import FooterComponent from "@/app/components/footer/FooterComponent";
import WorkBoxes from "../_components/WorkBoxes";

const Proyectos = () => {
  return (
    <div className="relative">
      <BigText />
      <hr className="my-20" />
      <WorkBoxes />
      <FooterComponent />
    </div>
  );
};

export default Proyectos;
