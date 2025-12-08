// store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const applyThemeToHtml = (isDark: boolean) => {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      isDark:
        typeof window !== "undefined"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false,

      setTheme: (theme: Theme) => {
        const isDark =
          theme === "dark"
            ? true
            : theme === "light"
            ? false
            : window.matchMedia("(prefers-color-scheme: dark)").matches;

        set({ theme, isDark });
        applyThemeToHtml(isDark); // Apply instantly
      },
    }),
    {
      name: "theme-preference",
      onRehydrateStorage: () => (state) => {
        // This runs after hydration — re-apply just in case
        if (state) applyThemeToHtml(state.isDark);
      },
    }
  )
);
