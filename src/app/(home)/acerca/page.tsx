"use client";
import React from "react";
import PageHeader from "../_components/PageHeader";
import AboutUsComponent from "./_components/AboutUsComponent";
import PixelTransition from "@/app/components/transitions/PixelTransition";

const Acerca = () => {
  const maskText: string =
    "Queremos saber sobre tu negocio - trabajemos en implementar una estrategia digital personalizada.";
  const mainTextOne: string = "Platiquemos sobre ";
  const mainTextSpan: string = "tu marca";
  const mainTextTwo: string =
    ", descubramos como podemos ayudarte a impulsar tu alcance al máximo.";

  return (
    <div>
      <PixelTransition />
      <div className="min-h-screen flex flex-col">
        <PageHeader
          maskText={maskText}
          mainTextOne={mainTextOne}
          mainTextSpan={mainTextSpan}
          mainTextTwo={mainTextTwo}
        />
        <AboutUsComponent />
      </div>
    </div>
  );
};

export default Acerca;
