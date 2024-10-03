import Image from "next/image";
import clsx from "clsx"; // Utility for conditional classes
import { motion } from "framer-motion";

interface ExpandableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  isExpanded: boolean;
  onClick: () => void;
}

export default function ExpandableImage({
  src,
  alt,
  width,
  height,
  isExpanded,
  onClick,
}: ExpandableImageProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={isExpanded ? { scale: 1.7 } : { scale: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "relative cursor-pointer overflow-hidden transition-all duration-300",
        isExpanded
          ? "fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-90"
          : ""
      )}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={isExpanded ? 900 : width}
        height={isExpanded ? 900 : height}
        className={clsx(
          "rounded-lg transition-transform duration-300 object-cover",
          isExpanded ? "w-auto h-auto" : "w-full h-full"
        )}
        priority={true}
      />
    </motion.div>
  );
}
