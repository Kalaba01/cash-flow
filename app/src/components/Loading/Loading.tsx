"use client";
import styles from "./Loading.module.scss";
import { useTranslations } from "next-intl";
import { ReactTyped } from "react-typed";

export default function Loading() {
  const t = useTranslations("loading");

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>
        {t("loading")}
        <ReactTyped
            strings={["..."]}
            typeSpeed={200}
            loop={true}
            showCursor={true}
          />
      </p>
    </div>
  );
}
