"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import "./menu.css";
import WhiteLogoComponent from "@/app/components/Logos/WhiteLogoComponent";
import DarkLogoComponent from "@/app/components/Logos/DarkLogoComponent";

gsap.registerPlugin(useGSAP);

const menuLinks = [
  { path: "/", label: "Inicio" },
  { path: "/proyectos", label: "Casos de Éxito" },
  { path: "/acerca", label: "Acerca" },
  { path: "/contacto", label: "Contacto" },
];

const Menu = (): JSX.Element => {
  const container = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tl = useRef(gsap.timeline({ paused: true }));
  useGSAP(
    () => {
      gsap.set(".menu-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        opacity: 0,
        display: "none",
      });

      gsap.set(".menu-link-item-holder", { y: 175 });

      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          opacity: 1,
          display: "flex",
          ease: "power4.inOut",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
          delay: -0.75,
        });
    },
    { scope: container }
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse();
    }
  }, [isMenuOpen]);

  return (
    <div className={`menu-container relative overflow-hidden`} ref={container}>
      <div className="menu-bar bg-black bg-opacity-50">
        <div className="menu-logo">
          <Link href={"/"}>
            <WhiteLogoComponent />
          </Link>
        </div>
        <div className="menu-open" onClick={toggleMenu}>
          <p>Menu</p>
        </div>
      </div>

      <div className={`menu-overlay  ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="menu-overlay-bar">
          <div className="menu-logo">
            <Link href={"/"}>
              <DarkLogoComponent />
            </Link>
          </div>
          <div className="menu-close" onClick={toggleMenu}>
            <p>Cerrar</p>
          </div>
        </div>
        <div className="menu-close-icon" onClick={toggleMenu}>
          <p>&#x2715;</p>
        </div>
        <div className="menu-copy">
          <div className="menu-links">
            {menuLinks.map(
              (link: { path: string; label: string }, index: number) => (
                <div className="menu-link-item" key={index}>
                  <div className="menu-link-item-holder" onClick={toggleMenu}>
                    <Link href={link.path} className="menu-link">
                      {link.label}
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="menu-info">
            <div className="menu-info-col">
              <Link href={"https://www.facebook.com/HuevitosRevueltos"}>
                Facebook &#8599;
              </Link>
              <Link href={"https://www.instagram.com/eggs.bakey.publicidad/"}>
                Instagram &#8599;
              </Link>
            </div>
            <div className="menu-info-col">
              <p>huevitos@hotmail.com</p>
              <p>353 123 4567</p>
            </div>
          </div>
        </div>
        <div className="menu-preview">
          <p>Ver Reels</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
