"use client";
import styles from "./HamburgerMenu.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FaTachometerAlt, FaUser, FaMoneyBillWave, FaChartPie, FaBullseye, FaTimes, FaBars } from "react-icons/fa";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("hamburgerMenu");
  const router = useRouter();

  const menuItems = [
    { name: t("dashboard"), icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: t("profile"), icon: <FaUser />, path: "/profile" },
    { name: t("income"), icon: <FaMoneyBillWave />, path: "/income" },
    { name: t("expense"), icon: <FaChartPie />, path: "/expense" },
    { name: t("goal"), icon: <FaBullseye />, path: "/goal" }
  ];

  return (
    <div className={styles.hamburgerMenu}>
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menu}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>

            <ul>
              {menuItems.map((item, index) => (
                <li key={index} onClick={() => { router.push(item.path); setIsOpen(false); }}>
                  {item.icon}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
