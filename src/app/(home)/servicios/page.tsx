"use client";
import React from "react";
import PageHeader from "../_components/PageHeader";
import PageTransition from "@/app/components/transitions/PageTransition";
const Servicios = () => {
  const maskText: string =
    "Desarrollamos tu marca - implementando las estrategias de marketing mas efectivas en base a tu publico ideal.";
  const mainTextOne: string = "Nuestra agencia se";
  const mainTextSpan: string = " especializada en marketing digital";
  const mainTextTwo: string =
    ",creamos el contenido que tus seguidores quieren ver.";
  return (
    <div className="min-h-screen flex flex-col">
      <PageTransition />

      <PageHeader
        maskText={maskText}
        mainTextOne={mainTextOne}
        mainTextSpan={mainTextSpan}
        mainTextTwo={mainTextTwo}
      />
    </div>
  );
};

export default Servicios;
