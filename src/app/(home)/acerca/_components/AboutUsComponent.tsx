"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionTextComponent from "@/app/components/texts/SectionTextComponent";
import CardTextComponent from "@/app/components/texts/CardTextComponent";
import HeroTextComponent from "@/app/components/texts/HeroTextComponent";
// Placeholder images
import InnerSectionTextComponent from "@/app/components/texts/InnerSectionTextComponent";
import HeroColTextComponent from "@/app/components/texts/HeroColTextComponent";

const AboutUsComponent = () => {
  return (
    <div>
      <section className="min-h-[400px] bg-[#dac340] flex flex-row maxsm:flex-col justify-center items-center relative overflow-hidden">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-black z-10">
          <HeroColTextComponent
            pretitle={"Eggs & Bakey"}
            title={"CONÓCENOS"}
            subtitle={"Obten resultados con la mejor agencia digital."}
            word={""}
          />
        </div>
      </section>

      <section className=" text-center py-12 my-20 mx-auto">
        <div className="container mx-auto">
          <InnerSectionTextComponent
            title={"Por Qué Elegir Eggs and Bakey?"}
            paraOne={"En Eggs & Bakey nos dedicamos a brindar:"}
            paraTwo={""}
            btnText={""}
            btnUrl={""}
          />

          <p className="text-gray-500 font-raleway ">{""}</p>

          <div className="flex maxmd:flex-col items-center justify-center gap-4 mt-5">
            <div className="w-full bg-foreground rounded-lg px-3 py-4 shadow-md">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4 }}
                className="relative"
              >
                <Image
                  src={"/icons/group-team.svg"}
                  width={400}
                  height={400}
                  alt="Icon"
                  className="mx-auto mb-4 w-20 h-20 rounded-sm "
                />
              </motion.div>

              <CardTextComponent
                title={"Equipo Profesional"}
                paraOne={
                  "Nuestros equipo de profesionales está enfocado, asegurando que tu proyecto no solo sea funcional sino también estéticamente agradable."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>

            <div className="w-full bg-foreground  rounded-sm px-3 py-4  shadow-md">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4 }}
                className="relative"
              >
                <Image
                  src={"/icons/customer-service.svg"}
                  width={400}
                  height={400}
                  alt="Icon"
                  className="mx-auto mb-4 w-20 h-20 rounded-sm"
                />
              </motion.div>
              <CardTextComponent
                title={"Atención Personalizada"}
                paraOne={
                  "Entendemos que cada proyecto es único. Por eso, estamos aquí para proponer la estrategia que mejor se adapten a tu empresa. Nuestro equipo está dedicado a brindarte una experiencia inigualable."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>

            <div className="w-full bg-foreground  rounded-sm  px-3 py-4  shadow-md">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4 }}
                className="relative"
              >
                <Image
                  src={"/icons/camera.svg"}
                  width={400}
                  height={400}
                  alt="Icon"
                  className="mx-auto mb-4 w-20 h-20 rounded-sm"
                />
              </motion.div>
              <CardTextComponent
                title={"Calidad Superior"}
                paraOne={
                  "Comprometidos con la excelencia, cada servicio de nuestro catálogo está diseñado para ofrecer los mejores resultados para nuestros clientes, asegurando exposición y resistencia."
                }
                paraTwo={""}
                btnText={""}
                btnUrl={""}
              />
              <div className="mt-10" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-[80%] maxmd:w-full maxmd:flex-col items-center mx-auto my-20 px-1">
        <section className="text-center w-1/2 maxmd:w-full">
          <div className="container mx-auto px-6 maxsm:px-3">
            <SectionTextComponent
              title={"Nuestra Misión"}
              paraOne={
                "Nuestra misión en Eggs & Bakey es simple: transformar la presencia con estrategias comprobadas que impulsen las marcas de nuestros clientes al siguiente nivel. "
              }
              paraTwo={""}
              btnText={"Contactar"}
              btnUrl={`/contacto`}
            />
          </div>
        </section>

        <section className=" text-center w-1/2 maxmd:w-full maxmd:mt-5">
          {/* Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex gap-x-4 mt-2 justify-center"
          >
            <div className="bg-[#dac340] rounded-xl p-2 shadow-md">
              <Image
                src={"/images/img-1.jpg"}
                width={800}
                height={800}
                alt="Eggs & Bakey"
                className="mx-auto mb-4 w-full h-full"
              />
            </div>
          </motion.div>
        </section>
      </div>

      <section className="min-h-[900px] flex flex-row maxsm:flex-col justify-center items-center relative bg-[#dac340] text-black">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 bg-foreground z-10">
          <HeroTextComponent
            title={"Creando Una Marca Espectacular un Proyecto a la Vez."}
            subtitle={
              "En Eggs & Bakey, nos enfocamos en desarrollar una marca unica que resalte de tu competencia."
            }
            btnText={"Platiquemos"}
            btnUrl={`/contacto`}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsComponent;
