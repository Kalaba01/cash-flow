"use client";
import styles from "./HeroSection.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Animated landing section with hero text and image
export default function HeroSection() {
  const t = useTranslations("heroSection");

  return (
    <motion.section
      id="home"
      className={styles.hero}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className={styles.content}>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
      <div className={styles.image}>
        <Image
          src="/hero.jpg"
          alt="Finance tracking illustration"
          width={400}
          height={400}
          priority
        />
      </div>
    </motion.section>
  );
}
