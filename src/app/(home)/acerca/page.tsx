"use client";
import React from "react";
import AboutUsComponent from "./_components/AboutUsComponent";
import FooterComponent from "@/app/components/footer/FooterComponent";

const Acerca = () => {
  return (
    <div>
      <div className=" flex flex-col">
        <AboutUsComponent />
      </div>
      <FooterComponent />
    </div>
  );
};

export default Acerca;
