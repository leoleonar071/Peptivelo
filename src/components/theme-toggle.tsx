"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
function subscribe(listener: () => void) {
  window.addEventListener("pv-theme-change", listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener("pv-theme-change", listener); window.removeEventListener("storage", listener); };
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "dark", () => false);
  return <button className="theme-toggle" type="button" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} aria-pressed={dark} onClick={() => {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("pv-theme", theme); } catch { /* Theme still works for this page when storage is unavailable. */ }
    window.dispatchEvent(new Event("pv-theme-change"));
  }}>{dark ? <Sun size={19} /> : <Moon size={19} />}<span>Theme</span></button>;
}
