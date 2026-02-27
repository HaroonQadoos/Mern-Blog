import React from "react";
import { useTheme } from "../context/ThemeContext";
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="px-3 py-2  dark:border-gray-700">
      {theme === "dark" ? "☀️ " : "🌙 "}
    </button>
  );
};

export default ThemeToggle;
