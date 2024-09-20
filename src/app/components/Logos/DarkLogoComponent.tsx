import Image from "next/image";

const DarkLogoComponent = () => {
  return (
    <div className="relative flex flex-col items-center justify-center max-w-fit">
      <div className=" flex justify-between maxmd:justify-center items-center">
        <Image
          alt="image"
          src={"/logos/EggsandBakeyLOGO.webp"}
          width={500}
          height={500}
          className={` overflow-hidden transition-all ease-in-out w-24 h-auto`}
        />
      </div>
    </div>
  );
};

export default DarkLogoComponent;
