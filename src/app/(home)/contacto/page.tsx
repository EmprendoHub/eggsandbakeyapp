import React from "react";
import PageHeader from "../_components/PageHeader";
import ContactComponent from "@/app/components/contact/ContactComponent";
import PixelTransition from "@/app/components/transitions/PixelTransition";
import ContactUsComponent from "@/app/components/contact/ContactUsComponent";
const Contacto = () => {
  const maskText: string =
    "Queremos saber sobre tu negocio - trabajemos en implementar una estrategia digital personalizada.";
  const mainTextOne: string = "Platiquemos sobre ";
  const mainTextSpan: string = "tu marca";
  const mainTextTwo: string =
    ", descubramos como podemos ayudarte a impulsar tu alcance al máximo.";

  return (
    <div className="min-h-screen flex flex-col">
      <PixelTransition />

      <PageHeader
        maskText={maskText}
        mainTextOne={mainTextOne}
        mainTextSpan={mainTextSpan}
        mainTextTwo={mainTextTwo}
      />
      <ContactComponent />
      <ContactUsComponent
        contactTitle={"Mándanos un breve mensaje"}
        contactSubTitle={
          "En breve uno de nuestros representantes se comunicara."
        }
      />
    </div>
  );
};

export default Contacto;
