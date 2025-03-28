"use client";
import styles from "./Logout.module.scss";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      <FaSignOutAlt className={styles.icon} />
    </button>
  );
}
