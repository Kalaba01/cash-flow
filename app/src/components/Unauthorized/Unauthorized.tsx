"use client";
import styles from "./Unauthorized.module.scss";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaLock, FaHome } from "react-icons/fa";

export default function Unauthorized() {
  const t = useTranslations("unauthorized");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FaLock className={styles.icon} />
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
