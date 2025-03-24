"use client";
import styles from "./TopBar.module.scss";
import { useState } from "react";
import { FaUser, FaMoon } from "react-icons/fa";
import { Login, Register, Language } from "@/components";

export default function TopBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>Cash Flow</h1>
      <div className={styles.icons}>
        <FaUser className={styles.icon} onClick={() => setIsLoginOpen(true)} />
        <FaMoon className={styles.icon} />
        <Language />
      </div>

      {isLoginOpen && (
        <Login
          onClose={() => setIsLoginOpen(false)}
          onRegisterOpen={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}

      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onLoginOpen={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </header>
  );
}
