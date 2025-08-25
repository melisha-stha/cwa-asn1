"use client";

import { useState, useEffect } from "react";

const Theme = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
      document.body.classList.remove("bg-light", "text-dark");
    } else {
      document.body.classList.add("bg-light", "text-dark");
      document.body.classList.remove("bg-dark", "text-white");
    }
  }, [darkMode]);

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="themeToggle"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <label className="form-check-label" htmlFor="themeToggle">
        {darkMode ? "Light" : "Dark"}
      </label>
    </div>
  );
};

export default Theme;
