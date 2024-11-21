import Image from "next/image";
import React from "react";

const ImageCard = () => {
  return (
    <div className="h-[70vh] overflow-hidden flex items-center justify-center">
      <Image
        src={"/images/yellowpop.webp"}
        width={1500}
        height={1000}
        alt="image"
        className=" object-cover "
      />
    </div>
  );
};

export default ImageCard;
