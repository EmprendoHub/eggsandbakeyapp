"use client";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import {
  FaCcVisa,
  FaCcStripe,
  FaCcPaypal,
  FaCcMastercard,
  FaCcDiscover,
} from "react-icons/fa";
import WhiteLogoComponent from "../Logos/WhiteLogoComponent";
import Link from "next/link";
import { motion } from "framer-motion";

const FooterMenu = () => {
  return (
    <div className="relative w-full text-foreground  bg-background px-20 maxmd:px-5 py-24 overflow-x-hidden">
      <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-10">
        <div className=" gap-y-4">
          <WhiteLogoComponent />
          <p className="text-xs mt-2">{"Blvd. Lázaro Cárdenas Nte. 175"}</p>
          <p className="text-xs">{"Sahuayo de Morelos,"}</p>
          <p className="text-xs mb-10">{"Michoacan 59000"}</p>
          <div className="flex items-center gap-x-4">
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.tiktok.com/eggsandbakey"
              target="_blank"
            >
              <span className="socialLink">
                <BsTiktok className="text-xs" />
              </span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.instagram.com/eggsandbakey"
              target="_blank"
            >
              <span className="socialLink">
                <BsInstagram className="text-xs" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.facebook.com/eggsandbakey"
              target="_blank"
            >
              <span className="socialLink">
                <BsFacebook className="text-xs" />
              </span>
            </motion.a>
          </div>
        </div>
        <div>
          <p className="text-sm">Explorar Proyectos</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/proyecto/0`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Brazza"}
              </motion.li>
            </Link>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/proyecto/1`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"Super 24"}
              </a>
            </motion.li>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/proyecto/2`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"Cloe MTV"}
              </a>
            </motion.li>

            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/proyecto/3`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"La Cochera"}
              </a>
            </motion.li>
          </ul>
        </div>
        <div>
          <p className="text-sm">{"Mapa del Sitio"}</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/acerca`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Acerca de Nosotros"}
              </motion.li>
            </Link>
            <Link href={`/servicios`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Servicios"}
              </motion.li>
            </Link>
            <Link href={`/contacto`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Contacto"}
              </motion.li>
            </Link>
            <Link href={`/proyectos`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Proyectos"}
              </motion.li>
            </Link>
          </ul>
        </div>
        <div>
          <p className="text-sm mb-2"> {"Declaraciones Legales"}</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/terminos`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Términos de Uso"}
              </motion.li>
            </Link>

            <Link href={`/politica`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Política de privacidad"}
              </motion.li>
            </Link>
          </ul>

          <div className="pt-5 flex flex-row flex-wrap items-center justify-start gap-x-4">
            <FaCcVisa className="text-xs" />
            <FaCcStripe className="text-xs" />
            <FaCcPaypal className="text-xs" />
            <FaCcMastercard className="text-xs" />
            <FaCcDiscover className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
