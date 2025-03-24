"use client";
import styles from "./Functionalities.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Functionalities() {
  const t = useTranslations("functionalities");

  return (
    <section id="features" className={styles.functionalities}>
      <div className={styles.heading}>
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>

      <motion.div
        className={styles.block}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.image}>
          <Image
            src="https://placehold.co/400x300"
            alt="Income Tracking"
            width={400}
            height={300}
          />
        </div>
        <div className={styles.text}>
          <h2>{t("incomeTitle")}</h2>
          <p>{t("incomeDescription")}</p>
        </div>
      </motion.div>

      <motion.div
        className={`${styles.block} ${styles.reverse}`}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.image}>
          <Image
            src="https://placehold.co/400x300"
            alt="Expense Management"
            width={400}
            height={300}
          />
        </div>
        <div className={styles.text}>
          <h2>{t("expensesTitle")}</h2>
          <p>{t("expensesDescription")}</p>
        </div>
      </motion.div>

      <motion.div
        className={styles.centerBlock}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.image}>
          <Image
            src="https://placehold.co/400x300"
            alt="Financial Goals"
            width={400}
            height={300}
          />
        </div>
        <div className={styles.text}>
          <h2>{t("goalsTitle")}</h2>
          <p>{t("goalsDescription")}</p>
        </div>
      </motion.div>
    </section>
  );
}
