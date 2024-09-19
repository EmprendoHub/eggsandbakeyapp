"use client";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./cardsplits.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function CardsSplit(): JSX.Element {
  useGSAP(() => {
    // Setup ScrollTrigger and GSAP animations
    const scrollTriggerSetting = {
      trigger: ".splits-main",
      start: "top 25%",
      end: "bottom bottom", // Change this to allow scrolling past the component
      toggleActions: "play reverse play reverse",
    };

    const leftXValues: number[] = [-800, -900, -400];
    const rightXValues: number[] = [800, 900, 400];
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
              start: "top center",
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
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSetting,
    });

    gsap.to(".splits-line p", {
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSetting,
    });

    gsap.to("button", {
      y: 0,
      opacity: 1,
      delay: 0.25,
      duration: 0.5,
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
        <div className="splits-row" key={i}>
          <div className="splits-card card-left">
            <Image
              width={850}
              height={850}
              src={`/images/img-${2 * i - 1}.jpg`}
              alt=""
            />
          </div>
          <div className="splits-card card-right">
            <Image
              width={850}
              height={850}
              src={`/images/img-${2 * i}.jpg`}
              alt=""
            />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <>
      <div className="splits">
        <section className="splits-hero">
          <div className="img">
            <Image
              width={850}
              height={850}
              src="/logos/LOGO-BLANCO.webp"
              alt="Eggs & Bakey"
            />
          </div>
        </section>
        <section className="splits-main">
          <div className="splits-main-content">
            <div className="splits-logo">
              <Image
                width={850}
                height={850}
                src="/logos/LOGO-BLANCO.webp"
                alt="Eggs & Bakey"
              />
            </div>
            <div className="splits-copy">
              <div className="splits-line">
                <p>Desarrolla código estructurado</p>
              </div>
              <div className="splits-line">
                <p>Desarrolla código estructurado</p>
              </div>
              <div className="splits-line">
                <p>Desarrolla código estructurado</p>
              </div>
            </div>

            <button>Get PRO</button>
          </div>

          {generateRows()}
        </section>
        <section className="splits-footer">
          <Link href={"/"}>Link in description</Link>
        </section>
      </div>
    </>
  );
}

export default CardsSplit;
