import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  nameAr: string;
  tagAr: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardColor: string;
  textColor: string;
  ctaStart: string;
  ctaEnd: string;
  isDark: boolean;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "00", name: "Original", nameAr: "الأصلي", tagAr: "البرتقالي الكلاسيكي",
    primaryColor: "#F97316", secondaryColor: "#EA580C",
    bgColor: "#FFFFFF", cardColor: "#FFFFFF", textColor: "#0F0F0F",
    ctaStart: "#F97316", ctaEnd: "#EA580C", isDark: false,
  },
  {
    id: "01", name: "Contemporary Luxury", nameAr: "الفاخر المعاصر", tagAr: "نيفي + ذهبي ملكي",
    primaryColor: "#C9A84C", secondaryColor: "#0F172A",
    bgColor: "#FEFCF8", cardColor: "#FFFFFF", textColor: "#0C0A07",
    ctaStart: "#0F172A", ctaEnd: "#1E293B", isDark: false,
  },
  {
    id: "02", name: "Arabic Heritage", nameAr: "النضارة العربية", tagAr: "زمردي + عنبري",
    primaryColor: "#065F46", secondaryColor: "#D97706",
    bgColor: "#FDFAF5", cardColor: "#FFFFFF", textColor: "#1C1407",
    ctaStart: "#065F46", ctaEnd: "#047857", isDark: false,
  },
  {
    id: "03", name: "Bold Minimalism", nameAr: "الحداثة الجريئة", tagAr: "أسود + برتقالي كهربائي",
    primaryColor: "#FF6B00", secondaryColor: "#0A0A0A",
    bgColor: "#FFFFFF", cardColor: "#FFFFFF", textColor: "#080808",
    ctaStart: "#0A0A0A", ctaEnd: "#1A1A1A", isDark: false,
  },
  {
    id: "04", name: "Soft Luxe", nameAr: "الأناقة الرقيقة", tagAr: "بنفسجي + وردي",
    primaryColor: "#6D28D9", secondaryColor: "#E879A0",
    bgColor: "#FDF8F5", cardColor: "#FFFFFF", textColor: "#1A0030",
    ctaStart: "#6D28D9", ctaEnd: "#4C1D95", isDark: false,
  },
  {
    id: "05", name: "Digital Prestige", nameAr: "الرقي الرقمي", tagAr: "فيروزي + عنبر",
    primaryColor: "#0D9488", secondaryColor: "#F59E0B",
    bgColor: "#FAFAFA", cardColor: "#FFFFFF", textColor: "#111827",
    ctaStart: "#0D9488", ctaEnd: "#0F766E", isDark: false,
  },
  {
    id: "06", name: "The Emperor", nameAr: "الإمبراطوري", tagAr: "مخمل أسود + ذهب عثماني",
    primaryColor: "#C8963C", secondaryColor: "#8B1A1A",
    bgColor: "#0E0A06", cardColor: "#1C1410", textColor: "#F2E8D9",
    ctaStart: "#7B1818", ctaEnd: "#5C1010", isDark: true,
  },
  {
    id: "07", name: "Daylight Pearl", nameAr: "لؤلؤ النهار", tagAr: "لؤلؤ ناصع + ذهب الكونياك",
    primaryColor: "#7A5C1E", secondaryColor: "#C8A96E",
    bgColor: "#F9F7F2", cardColor: "#FFFEFB", textColor: "#0D0A07",
    ctaStart: "#1A1512", ctaEnd: "#0D0A07", isDark: false,
  },
  {
    id: "08", name: "Cartier Rose", nameAr: "كارتييه الوردي", tagAr: "روز غولد + غارنيت عميق",
    primaryColor: "#B25068", secondaryColor: "#D4A574",
    bgColor: "#FFF4F2", cardColor: "#FFFFFF", textColor: "#1A080E",
    ctaStart: "#6B1A2A", ctaEnd: "#5C1020", isDark: false,
  },
  {
    id: "09", name: "Imperial Jade", nameAr: "اليشم الإمبراطوري", tagAr: "يشم ملكي + ذهب أنتيك",
    primaryColor: "#1A5C3A", secondaryColor: "#B8860B",
    bgColor: "#F4F8F4", cardColor: "#FFFFFF", textColor: "#0A1F14",
    ctaStart: "#1A5C3A", ctaEnd: "#145230", isDark: false,
  },
  {
    id: "10", name: "Black Cosmos", nameAr: "الكون الأسود", tagAr: "فضاء مطلق + ذهب نجمي",
    primaryColor: "#F5C518", secondaryColor: "#3B82F6",
    bgColor: "#06060C", cardColor: "#0E0E1A", textColor: "#EEEEFF",
    ctaStart: "#F5C518", ctaEnd: "#D4A800", isDark: true,
  },
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
