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
    <button
    className={`btn ${darkMode ? "btn-light" : "btn-dark"} px-4 py-2 text-nowrap`}
    style={{ minWidth: "120px" }}
    onClick={() => setDarkMode(!darkMode)}
    >
    {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default Theme;
