"use client";
import React from "react";
import Slider, { CustomArrowProps } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { testimonials } from "@/constants/testimoniolsdata";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";

// Custom Next Arrow
const NextArrow: React.FC<CustomArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 maxsm:right-[-25px] top-[50%] z-10 cursor-pointer transform -translate-y-1/2 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <ChevronRight className="text-gray-100 w-10 h-10" />
    </div>
  );
};

// Custom Prev Arrow
const PrevArrow: React.FC<CustomArrowProps> = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 maxsm:left-[-25px] top-[50%] z-10 cursor-pointer transform -translate-y-1/2 text-white p-2 rounded-full shadow-md"
      onClick={onClick}
    >
      <ChevronLeft className="text-gray-100 w-10 h-10" />
    </div>
  );
};

const TestimonialComponent = () => {
  const starRating = (props: number) => {
    const starArray = Array.from({ length: props }, (_, index) => (
      <span key={index} className="text-yellow-500">
        <Star />
      </span>
    ));
    return <>{starArray}</>;
  };

  const settings = {
    className: "center mx-auto flex ",
    dots: true,
    centerMode: true,
    infinite: true,
    centerPadding: "1px",
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "10px",
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="testimonial-class my-10 maxmd:my-10 px-40 maxmd:px-10 overflow-hidden">
      <motion.h2
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className=" font-bold text-6xl maxsm:text-4xl tracking-wider uppercase"
      >
        Testimonios
      </motion.h2>
      <motion.p
        initial={{ x: -180, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.3 }}
        className=" pb-10 text-xs "
      >
        Que dicen nuestros clientes
      </motion.p>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4 }}
      >
        <Slider {...settings} className="">
          {testimonials.map((testimonial, index) => {
            return (
              <div key={index} className="px-2">
                <div className="p-5 flex flex-col relative top-[30.34px] drop-shadow-md rounded-lgi bg-nackground text-gray-500 w-[90%] maxmd:w-[100%] h-[380px] maxsm:max-h-[380px] text-dimgray-200">
                  <div className="rate flex-row">
                    <div className="stars flex items-center gap-x-1">
                      {starRating(testimonial.rating)}
                      <span className="font-medium text-2xl">
                        {testimonial.rating}
                      </span>
                    </div>
                  </div>
                  <div className="max-w-full">
                    <p className="m-0 p-3 text-xs maxsm:text-xs leading-[118%] font-normal   flex">
                      {testimonial.message}
                    </p>
                  </div>

                  <div className="author flex flex-row pl-3 ">
                    <Image
                      width={60}
                      height={60}
                      quality={100}
                      className="flex flex-row mr-4 rounded-full w-8 h-8"
                      alt="avatar"
                      src={testimonial.image}
                    />
                    <div className="flex flex-col">
                      <div className="leading-[146%] text-[12px] font-medium  inline-block">
                        {testimonial.position}
                      </div>
                      <div className="leading-[123%] maxsm:text-xs maxmd:text-xs font-medium text-foreground inline-block ">
                        {testimonial.name}
                      </div>
                    </div>
                  </div>
                  <h2 className="m-0 absolute bottom-10 right-5 text-53xl leading-[68.5%] font-medium text-center inline-block w-[95.09px] h-[85.03px]">
                    <span className="font-poppins text-9xl opacity-25 text-blueLight">
                      ❞
                    </span>
                  </h2>
                </div>
              </div>
            );
          })}
        </Slider>
      </motion.div>
    </div>
  );
};

export default TestimonialComponent;
