import { create } from "zustand";
import { persist } from "zustand/middleware";

type TTheme = "dark" | "light" | "system";

interface IThemeState {
  theme: TTheme;
  isDark: boolean;
  setTheme: (theme:TTheme) => void;
  toggle: () => void;
}

export const useThemeStore = create<IThemeState>()(
  persist(
    (set, get) => ({
      theme: "system" as TTheme, // default
      isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,

      setTheme: (theme) => {
        const isDark =
          theme === "dark"
            ? true
            : theme === "light"
            ? false
            : window.matchMedia("(prefers-color-scheme: dark)").matches;

        set({ theme, isDark });
        document.documentElement.dataset.theme = isDark ? "dark" : "light";
      },

      toggle: () => {
        const current = get().theme;
        const next = current === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
    }),
    {
      name: "theme-preference", // localStorage key
    }
  )
);

// Auto-sync with system changes when user hasn't manually chosen
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    const { theme } = useThemeStore.getState();
    if (theme === "system") {
      useThemeStore.getState().setTheme("system");
    }
  });

  // Initial sync
  const { theme } = useThemeStore.getState();
  if (theme === "system") {
    useThemeStore.getState().setTheme("system");
  }
}