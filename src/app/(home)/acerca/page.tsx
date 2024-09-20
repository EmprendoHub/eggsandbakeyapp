"use client";
import React from "react";
import PageHeader from "../_components/PageHeader";
import AboutUsComponent from "./_components/AboutUsComponent";
import PixelTransition from "@/app/components/transitions/PixelTransition";

const Acerca = () => {
  const maskText: string =
    "Desarrollamos tu marca - implementando las estrategias de marketing mas efectivas en base a tu publico ideal.";
  const mainTextOne: string = "Nuestra agencia se";
  const mainTextSpan: string = " especializada en marketing digital";
  const mainTextTwo: string =
    ",creamos el contenido que tus seguidores quieren ver.";
  return (
    <>
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
    </>
  );
};

export default Acerca;
