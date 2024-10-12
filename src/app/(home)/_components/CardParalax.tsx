"use client";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import styles from "./parallaxpage.module.scss";
import Link from "next/link";

interface CardParalaxProps {
  i: number;
  title: string;
  description: string[];
  src: string;
  url: string;
  color: string[];
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const CardParalax = ({
  i,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardParalaxProps) => {
  const containerInner = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerInner,
    offset: ["start end", "start start"], // Keep this for the parallax effect
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={containerInner} className={styles.cardContainer}>
      <motion.div
        style={{
          background: `linear-gradient(${color[0]}, ${color[1]})`,
          scale, // Maintain the scaling effect
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={styles.card}
      >
        <h2>{title}</h2>
        <div className={styles.body}>
          <div className={styles.description}>
            <p>{description[0]}</p>
            <span className="hover:scale-105 duration-300 ease-in-out">
              <Link href={url}>Ver más</Link>
            </span>
          </div>
          <div className={styles.imageContainer}>
            <motion.div className={styles.inner} style={{ scale: imageScale }}>
              <Link href={url}>
                <Image
                  fill
                  src={`${src}`}
                  alt="image"
                  className="hover:scale-110 duration-300 ease-in-out"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardParalax;
