"use client";
import styles from "./TopBar.module.scss";
import { Login, Language } from "@/components";
import { FaMoon } from "react-icons/fa";

export default function TopBar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.container}>
        <h1 className={styles.title}>Cash Flow</h1>
      </div>
      <div className={styles.icons}>
        <Login />
        <FaMoon className={styles.icon} />
        <Language />
      </div>
    </header>
  );
}
