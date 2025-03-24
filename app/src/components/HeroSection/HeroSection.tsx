"use client";
import styles from "./HeroSection.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
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
        <h1>Take Control of Your Finances</h1>
        <p>Track your income, expenses, and financial goals in one place.</p>
      </div>
      <div className={styles.image}>
        <Image
          src="https://placehold.co/400x400"
          alt="Finance tracking illustration"
          width={400}
          height={400}
          priority
        />
      </div>
    </motion.section>
  );
}
