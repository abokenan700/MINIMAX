import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "00" | "01" | "02" | "03" | "04" | "05";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  nameAr: string;
  primaryColor: string;
  secondaryColor: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "00", name: "Original",             nameAr: "الأصلي",          primaryColor: "#F97316", secondaryColor: "#EA580C" },
  { id: "01", name: "Contemporary Luxury",  nameAr: "الفاخر المعاصر",  primaryColor: "#C9A84C", secondaryColor: "#0F172A" },
  { id: "02", name: "Arabic Heritage",      nameAr: "النضارة العربية", primaryColor: "#065F46", secondaryColor: "#D97706" },
  { id: "03", name: "Bold Minimalism",      nameAr: "الحداثة الجريئة", primaryColor: "#0A0A0A", secondaryColor: "#FF6B00" },
  { id: "04", name: "Soft Luxe",            nameAr: "الأناقة الرقيقة", primaryColor: "#6D28D9", secondaryColor: "#E879A0" },
  { id: "05", name: "Digital Prestige",     nameAr: "الرقي الرقمي",    primaryColor: "#0D9488", secondaryColor: "#F59E0B" },
];

const STORAGE_KEY = "nakhba_theme";

interface ThemeContextValue {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themes: ThemeMeta[];
  currentTheme: ThemeMeta;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (stored && THEMES.find(t => t.id === stored)) return stored;
    } catch {}
    return "00";
  });

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeId === "00") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", themeId);
    }
  }, [themeId]);

  const currentTheme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, themes: THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
