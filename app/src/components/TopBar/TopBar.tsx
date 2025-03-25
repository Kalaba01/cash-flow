"use client";
import styles from "./TopBar.module.scss";
import { useState } from "react";
import { Login, Register, ForgotPassword, Theme, Language } from "@/components";

export default function TopBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>Cash Flow</h1>
      <div className={styles.icons}>
        <Login
          onOpen={() => setIsLoginOpen(true)}
          onClose={() => setIsLoginOpen(false)}
          onRegisterOpen={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
          onForgotPasswordOpen={() => {
            setIsLoginOpen(false);
            setIsForgotPasswordOpen(true);
          }}
          isOpen={isLoginOpen}
        />
        <Theme />
        <Language />
      </div>

      {isRegisterOpen && (
        <Register
          onClose={() => setIsRegisterOpen(false)}
          onLoginOpen={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}

      {isForgotPasswordOpen && <ForgotPassword onClose={() => setIsForgotPasswordOpen(false)} />}
    </header>
  );
}
