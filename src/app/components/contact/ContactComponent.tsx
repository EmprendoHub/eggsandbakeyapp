"use client";
import React from "react";
import { motion } from "framer-motion";
import IconListSectionComponent from "./IconListSectionComponent";

const ContactComponent = () => {
  return (
    <div>
      <section className="bg-black py-12 px-20 maxmd:px-5 maxsm:px-2 ">
        <div className="w-full flex flex-row maxmd:flex-col justify-center items-start">
          <div className="w-1/3 maxmd:w-full  text-lg text-slate-200 ">
            <IconListSectionComponent
              mainTitle={"Información de Contacto"}
              textTitleOne={"Números"}
              textTitleTwo={"Manda un mensaje"}
              textTitleThree={"Sucursal Sahuayo"}
              textTwo={"Escríbenos tus dudas"}
              textThree={"Platiquemos en persona"}
              phoneLinkOne={"tel:3315033604"}
              phoneLinkTextOne={"(+52)331-503-3604"}
              linkTwo={"mailto:huevitos.internos@gmail.com"}
              linkThree={"https://maps.app.goo.gl/Mi97vZy2BGk2SWGY6"}
              linkTwoText={"huevitos.internos@gmail.com"}
              textAddressThree={
                "Plaza Roma Piso 2, Blvd. Lázaro Cárdenas Nte. 175-interior L9, "
              }
              textAddressCThree={
                "Sahuayo de Morelos, Michoacan, Centro Uno 59000"
              }
              linkThreeText={"Ver en mapa"}
            />
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1 }}
            className="w-full pb-10 pl-5 maxmd:pl-1  flex flex-col justify-start items-start"
          >
            <div className="w-[100%] px-3map-class pt-5">
              <iframe
                className="border-none"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234.24287474326366!2d-102.71632770802208!3d20.05521736320608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842efdf9bec85863%3A0x1d5c1c0a47c0713c!2sBaykini%20depilaci%C3%B3n%20Sahuayo!5e0!3m2!1ses-419!2smx!4v1728905565767!5m2!1ses-419!2smx"
                width="100%"
                height="450"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactComponent;
