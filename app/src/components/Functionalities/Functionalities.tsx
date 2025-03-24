"use client";
import styles from "./Functionalities.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Functionalities() {
  return (
    <section id="features" className={styles.functionalities}>
      <div className={styles.heading}>
        <h2>Key Features</h2>
        <p>Explore the main functionalities of our app.</p>
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
          <h2>Track Your Income</h2>
          <p>
            Easily log and monitor your income sources to manage your cash flow.
          </p>
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
          <h2>Manage Expenses</h2>
          <p>Keep track of your spending and identify saving opportunities.</p>
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
          <h2>Set Financial Goals</h2>
          <p>
            Plan your budget and achieve your financial milestones effortlessly.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
