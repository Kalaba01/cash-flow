"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interface for notification props
interface NotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

// Function to show toast notification using react-toastify
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

// Component to render toast notification container
export function NotificationContainer() {
  return <ToastContainer />;
}
