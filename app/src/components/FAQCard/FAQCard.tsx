"use client";
import styles from "./FAQCard.module.scss";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FAQCardProps {
  question: string;
  answer: string;
}

export default function FAQCard({ question, answer }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
      <div className={styles.question} onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <FaChevronDown className={`${styles.icon} ${isOpen ? styles.rotate : ""}`} />
      </div>
      <div className={styles.answer}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
