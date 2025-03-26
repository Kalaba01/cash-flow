"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export function showNotification({ message, type }: NotificationProps) {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
}

export function NotificationContainer() {
  return <ToastContainer />;
}
