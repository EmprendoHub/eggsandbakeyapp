"use client";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./cardsplits.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import MovieModal from "./MovieModal";

gsap.registerPlugin(ScrollTrigger);

function CardsSplit(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleWatchNow = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    // Set the app element for React Modal, this is usually the root div in Next.js
    Modal.setAppElement(".splits"); // For Next.js
  }, []);

  useGSAP(() => {
    // Setup ScrollTrigger and GSAP animations
    const scrollTriggerSetting = {
      trigger: ".splits",
      start: "center 50%",
      end: "bottom bottom", // Change this to allow scrolling past the component
      toggleActions: "play reverse play reverse",
    };

    const leftXValues: number[] = [-600, -700, -200];
    const rightXValues: number[] = [600, 700, 200];
    const leftRotationValues: number[] = [-30, -20, -35];
    const rightRotationValues: number[] = [30, 20, 35];
    const yValues: number[] = [100, -150, -400];

    // Apply GSAP animations with ScrollTrigger
    gsap.utils
      .toArray<HTMLElement>(".splits-row")
      .forEach((row, index: number) => {
        const cardLeft = row.querySelector<HTMLElement>(".card-left");
        const cardRight = row.querySelector<HTMLElement>(".card-right");

        if (cardLeft && cardRight) {
          gsap.to(cardLeft, {
            x: leftXValues[index],
            scrollTrigger: {
              trigger: ".splits-main",
              start: "top 40%",
              end: "bottom bottom", // Change this to allow scrolling past the component
              scrub: true,
              onUpdate: (self): void => {
                const progress = self.progress;
                gsap.set(cardLeft, {
                  transform: `translateX(${
                    progress * leftXValues[index]
                  }px) translateY(${progress * yValues[index]}px) rotate(${
                    progress * leftRotationValues[index]
                  }deg)`,
                });
                gsap.set(cardRight, {
                  transform: `translateX(${
                    progress * rightXValues[index]
                  }px) translateY(${progress * yValues[index]}px) rotate(${
                    progress * rightRotationValues[index]
                  }deg)`,
                });
              },
            },
          });
        }
      });

    gsap.to(".splits-logo", {
      scale: 1,
      duration: 1.1,
      zIndex: 10,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSetting,
    });

    gsap.to(".splits-line p", {
      y: 0,
      stagger: 0.2,
      duration: 1.1,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSetting,
    });

    gsap.to("button", {
      y: 0,
      opacity: 1,
      delay: 0.5,
      duration: 1.1,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSetting,
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const generateRows = (): JSX.Element[] => {
    const rows: JSX.Element[] = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="splits-row " key={i}>
          <div className="splits-card card-left">
            <Image
              width={850}
              height={850}
              src={`/images/img-${2 * i - 1}.jpg`}
              alt=""
              className="splits-img"
            />
          </div>
          <div className="splits-card card-right">
            <Image
              width={850}
              height={850}
              src={`/images/img-${2 * i}.jpg`}
              alt=""
              className="splits-img"
            />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="relative">
      <div className="splits">
        <section className="splits-hero">
          <h2>Los Profesionales en Marketing</h2>
        </section>
        <section className="splits-main">
          <div className="splits-main-content">
            <div className="splits-logo">
              <Image
                width={100}
                height={100}
                src="/icons/play-svgrepo-com.svg"
                alt="Eggs & Bakey"
                className="cursor-pointer hover:scale-125 sc ease-in-out duration-300  play-button "
                onClick={() => handleWatchNow()}
              />
            </div>
            <div className="splits-copy">
              <div className="splits-line">
                <p>Influencer Marketing</p>
              </div>
              <div className="splits-line">
                <p>Gestión de Redes Sociales</p>
              </div>
              <div className="splits-line">
                <p>Desarrollo de Marca</p>
              </div>
            </div>

            <button>
              <Link href={"/contacto"}>y Mucho Mas +</Link>
            </button>
          </div>

          {generateRows()}
        </section>
      </div>
      <MovieModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        videoUrl="/videos/Reel_Letras_Grunge_Pagina_Eggs.webm"
      />
    </div>
  );
}

export default CardsSplit;
