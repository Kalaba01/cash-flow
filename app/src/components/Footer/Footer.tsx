"use client";
import styles from "./Footer.module.scss";
import { FaFacebookF, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2>Cash Flow</h2>
          <p>Track your finances with ease.</p>
        </div>

        <div className={styles.center}>
          <ul>
            <li><a href="#" onClick={(e) => scrollToSection(e, "home")}>Home</a></li>
            <li><a href="#" onClick={(e) => scrollToSection(e, "features")}>Features</a></li>
            <li><a href="#" onClick={(e) => scrollToSection(e, "faq")}>FAQ</a></li>
          </ul>
        </div>

        <div className={styles.right}>
          <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaFacebookF />
          </a>
          <a href="https://www.twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaXTwitter />
          </a>
          <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
