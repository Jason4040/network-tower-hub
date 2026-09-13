import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-2 border border-border-strong bg-background/90 px-3 font-mono text-[10px] tracking-[0.14em] text-foreground hover:border-accent max-md:h-10 max-md:px-2.5"
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="max-md:hidden">{light ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
