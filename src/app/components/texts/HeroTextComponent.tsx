"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroTextComponent = ({
  title,
  subtitle,
  btnText,
  btnUrl,
}: {
  title: string;
  subtitle: string;
  btnText: string;
  btnUrl: string;
}) => {
  return (
    <div className="relative w-full h-full">
      <div className="flex h-full flex-col items-center gap-y-6 justify-center">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="text-7xl maxmd:text-4xl font-bold font-EB_Garamond text-background"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-base  font-EB_Garamond w-[70%] text-background"
        >
          {subtitle}
        </motion.p>
        {btnText && btnUrl && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3 }}
            className="flex gap-x-4 mt-2 justify-center text-background"
          >
            <Link href={btnUrl}>
              <p className="py-3 px-8 rounded-full bg-black text-white hover:scale-110  duration-700 text-sm uppercase font-semibold w-full">
                {btnText}
              </p>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroTextComponent;
