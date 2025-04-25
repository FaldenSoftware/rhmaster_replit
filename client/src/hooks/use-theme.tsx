import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to load from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system")) {
      return savedTheme as Theme;
    }
    // Default to system
    return "system";
  });

  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      // If theme is system, detect user preference
      if (newTheme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", isDark);
      } else {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if theme is "system"
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };

      try {
        // Modern browsers
        mql.addEventListener("change", handleChange);
      } catch (e) {
        // Older browsers
        try {
          mql.addListener(handleChange);
        } catch (e2) {
          console.error("Browser doesn't support theme change detection", e2);
        }
      }

      return () => {
        try {
          mql.removeEventListener("change", handleChange);
        } catch (e) {
          try {
            mql.removeListener(handleChange);
          } catch (e2) {
            console.error("Browser doesn't support theme change detection", e2);
          }
        }
      };
    }
  }, [theme]);

  const setThemeWithStorage = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, setTheme: setThemeWithStorage };
}