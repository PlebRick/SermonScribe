import { useTheme as useNextTheme } from "../components/ThemeProvider";

export function useTheme() {
  const { theme, setTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark"
  };
}
