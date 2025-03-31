"use client";
import styles from "./TopBar.module.scss";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Login, Register, ForgotPassword, HamburgerMenu, Theme, Language, Logout } from "@/components";

export default function TopBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const sidebarRoutes = ["/dashboard", "/income", "/expense", "/profile", "/goal"];

  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isSidebarPage = sidebarRoutes.some(route => pathname.startsWith(route));

  return (
    <header className={styles.topbar}>
      { isSidebarPage && <HamburgerMenu />}
      <h1 className={styles.title}>Cash Flow</h1>
      <div className={styles.icons}>
      {isLandingPage && (
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
        )}

        <Theme />
        <Language />

        {isSidebarPage && <Logout />}
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
