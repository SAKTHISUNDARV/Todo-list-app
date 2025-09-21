// Alert.jsx
import React, { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

const Alert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // auto-hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: { bg: "bg-green-50", text: "text-green-800", icon: <FiCheckCircle /> },
    error: { bg: "bg-red-50", text: "text-red-800", icon: <FiXCircle /> },
    info: { bg: "bg-blue-50", text: "text-blue-800", icon: <FiInfo /> },
  };

  const { bg, text, icon } = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`fixed top-5 right-5 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bg} ${text} animate-slide-in`}
      style={{ minWidth: "250px", zIndex: 9999 }}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-sm font-bold hover:text-gray-600 transition"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;
