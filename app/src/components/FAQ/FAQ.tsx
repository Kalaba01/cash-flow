"use client";
import styles from "./FAQ.module.scss";
import { FAQCard } from "@/components";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const t = useTranslations("faq");
  const questions = t.raw("questions");

  return (
    <motion.section
      id="faq"
      className={styles.faq}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>{t("title")}</h2>
      <div className={styles.faqList}>
        {questions.map((faq: { q: string; a: string }, index: number) => (
          <FAQCard key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </motion.section>
  );
}
