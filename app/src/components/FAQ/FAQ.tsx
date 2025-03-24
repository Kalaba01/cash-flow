"use client";
import styles from "./FAQ.module.scss";
import FAQCard from "@/components/FAQCard/FAQCard";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does Cash Flow help manage my finances?",
    answer: "Cash Flow allows you to track your income, expenses, and budget in one place, helping you make informed financial decisions."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes! We use advanced encryption and security measures to protect your financial information."
  },
  {
    question: "Can I export my financial data?",
    answer: "Absolutely! You can download your financial records in CSV format for external use."
  },
];

export default function FAQ() {
  return (
    <motion.section
      id="faq"
      className={styles.faq}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>Frequently Asked Questions</h2>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <FAQCard key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </motion.section>
  );
}
