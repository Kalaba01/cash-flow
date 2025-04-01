"use client";
import styles from "./NotFound.module.scss";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

// 404 Not Found page component
export default function NotFound() {
  const t = useTranslations("notFound");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FaExclamationTriangle className={styles.icon} />
        </div>
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>

        <button className={styles.homeButton} onClick={() => router.push("/")}>
          <FaHome className={styles.buttonIcon} />
          {t("goHome")}
        </button>
      </div>
    </div>
  );
}
