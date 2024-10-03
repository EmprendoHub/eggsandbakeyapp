"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./cardsexpanding.css";
import Image from "next/image";
import Link from "next/link";

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
                ease: "power1.inOut",
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
    <div className="expanding overflow-x-hidden">
      <section className="expanding-services">
        <div className="expanding-services-header">
          <div className="expanding-col"></div>
          <div className="expanding-col">
            <h1>Proyectos</h1>
          </div>
        </div>

        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>BRAZZA GRILL HOUSE</h1>

            <p>
              A través de nuestras sesiones fotográficas, hemos dado vida a cada
              plato con imágenes que despiertan el apetito de los clientes,
              siguiendo al pie de la letra lo que nuestro socio nos solicitó.
            </p>
            <Link href={"/proyecto/0"}>
              <button className="bg-[#dac340] text-black text-xs py-3 mt-2 px-6 rounded-xl">
                Explorar proyecto
              </button>
            </Link>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Link href={"/proyecto/0"}>
                <Image
                  width={850}
                  height={850}
                  src="/images/img-1.jpg"
                  alt="BRAZZA GRILL HOUSE"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>SUPER 24</h1>

            <p>
              Mediante la implementación de grabaciones profesionales,
              fotografías creativas, y reels dinámicos en Instagram, hemos
              fortalecido la presencia de SUPER 24 en redes sociales.
            </p>
            <Link href={"/proyecto/1"}>
              <button className="bg-[#dac340] text-black text-xs py-3 mt-2 px-6 rounded-xl">
                Explorar proyecto
              </button>
            </Link>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Link href={"/proyecto/1"}>
                <Image
                  width={850}
                  height={850}
                  src="/images/img-2.jpg"
                  alt="SUPER 24"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>CLOE MTV</h1>

            <p>
              En colaboración con la marca de bolsas y accesorios CLOE X MTV,
              desarrollamos una campaña creativa para expandir la presencia de
              CLOE en el mercado juvenil Internacional, publicidad que se
              presentó en los aeropuertos.
            </p>
            <Link href={"/proyecto/2"}>
              <button className="bg-[#dac340] text-black text-xs py-3 mt-2 px-6 rounded-xl">
                Explorar proyecto
              </button>
            </Link>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Link href={"/proyecto/2"}>
                <Image
                  width={850}
                  height={850}
                  src="/images/img-3.jpg"
                  alt=""
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>LA COCHERA</h1>

            <p>
              Nos enorgullece presentar el proyecto La Cochera, donde hemos
              trabajado incansablemente para capturar la esencia única de sus
              productos y llevarlos al mundo digital.
            </p>
            <Link href={"/proyecto/3"}>
              <button className="bg-[#dac340] text-black text-xs py-3 mt-2 px-6 rounded-xl">
                Explorar proyecto
              </button>
            </Link>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Link href={"/proyecto/3"}>
                <Image
                  width={850}
                  height={850}
                  src="/images/img-4.jpg"
                  alt="LA COCHERA"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="expanding-service">
          <div className="expanding-service-info">
            <h1>POLÍTICA</h1>

            <p>
              Nos especializamos en marketing ATL (above the line) y BTL (below
              the line) para clientes del ámbito político.
            </p>
            <Link href={"/proyecto/4"}>
              <button className="bg-[#dac340] text-black text-xs py-3 mt-2 px-6 rounded-xl">
                Explorar proyecto
              </button>
            </Link>
          </div>
          <div className="expanding-service-img">
            <div className="expanding-img">
              <Link href={"/proyecto/4"}>
                <Image
                  width={850}
                  height={850}
                  src="/images/img-5.jpg"
                  alt="POLÍTICA"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CardsExpanding;
