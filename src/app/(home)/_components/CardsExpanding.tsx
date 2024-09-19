"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./cardsexpanding.css";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

function CardsExpanding(): JSX.Element {
  useGSAP(() => {
    const services = gsap.utils.toArray<HTMLElement>(".expanding-service");
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const service = entry.target as HTMLElement;
          const imgContainer =
            service.querySelector<HTMLElement>(".expanding-img");

          if (imgContainer) {
            ScrollTrigger.create({
              trigger: service,
              start: "bottom bottom",
              end: "bottom top", // or "+=100%"
              scrub: true,
              onUpdate: (self) => {
                const progress = self.progress;
                const newWidth = 30 + 70 * progress;

                gsap.to(imgContainer, {
                  width: `${newWidth}%`,
                  duration: 0.1,
                  ease: "none",
                });
              },
            });
          }

          ScrollTrigger.create({
            trigger: service,
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const newHeight = 150 + 300 * progress;

              gsap.to(service, {
                height: `${newHeight}%`,
                duration: 0.1,
                ease: "none",
              });
            },
          });

          observer.unobserve(service);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    services.forEach((service) => {
      observer.observe(service);
    });
  }, []);

  return (
    <div className="expanding">
      <section className="expanding-hero">
        <h1>Expande tu alcance</h1>
      </section>
      <section className="expanding-services">
        <div className="expanding-services-header">
          <div className="expanding-col"></div>
          <div className="expanding-col">
            <h1>Todos nuestros servicios</h1>
          </div>
        </div>

        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-1.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum 2</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-2.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum 3</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-3.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum 4</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-4.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum 5</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-5.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>Lorem Ipsum 6</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe,
              ducimus rem optio.
            </p>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Image width={850} height={850} src="/images/img-6.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="expanding-footer">
        <h1>Crece tu presencia</h1>
      </section>
    </div>
  );
}

export default CardsExpanding;
