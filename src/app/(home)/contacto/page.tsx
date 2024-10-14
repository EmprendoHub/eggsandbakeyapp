import React from "react";
import ContactComponent from "@/app/components/contact/ContactComponent";
import PixelTransition from "@/app/components/transitions/PixelTransition";
import ContactUsComponent from "@/app/components/contact/ContactUsComponent";
import FooterComponent from "@/app/components/footer/FooterComponent";
const Contacto = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <PixelTransition />
      <ContactUsComponent
        contactTitle={"Platiquemos sobre tu marca y su potencial alcance."}
        contactSubTitle={
          "Queremos saber mas sobre tu negocio - trabajemos en implementar una estrategia digital personalizada."
        }
      />
      <ContactComponent />

      <FooterComponent />
    </div>
  );
};

export default Contacto;
