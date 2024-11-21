"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CardParalaxProps {
  src: string;
  url: string;
}

const WorkCard = ({ src, url }: CardParalaxProps) => {
  return (
    <div>
      <motion.div>
        <div className="max-w-[450px] relative">
          <motion.div>
            <Link href={url}>
              <Image
                width={500}
                height={500}
                src={`${src}`}
                alt="image"
                className="hover:scale-110 duration-300 ease-in-out"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkCard;
