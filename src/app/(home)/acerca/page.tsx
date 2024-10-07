"use client";
import React from "react";
import PageHeader from "../_components/PageHeader";
import AboutUsComponent from "./_components/AboutUsComponent";
import PixelTransition from "@/app/components/transitions/PixelTransition";

const Acerca = () => {
  const maskText: string =
    "TRABAJAMOS DE LA MANO CON NUESTROS CLIENTES, PARA BRINDAR EL MEJOR SERVICIO INTEGRAL EN PUBLICIDAD DESDE MEDIANAS EMPRESAS HASTA AYUNTAMIENTOS DEL ESTADO.";
  const mainTextOne: string =
    "EGGS&BAKEY ES UNA EMPRESA DEDICADA A LA REALIZACIÓN DE PROYECTOS";
  const mainTextSpan: string = " AUDIOVISAULES Y GRÁFICOS ";
  const mainTextTwo: string =
    "COMPROMETIDA CON LA CALIDAD ENTREGADA A NUESTROS CLIENTES.";
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
