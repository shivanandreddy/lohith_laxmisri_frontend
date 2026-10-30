import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

// 20 Atlassian Jira-Inspired Professional Themes
export const THEMES = [
  {
    id: "jira-dark",
    name: "Jira Dark (Default)",
    bg: "#1d2125",
    surface: "#22272b",
    card: "#282e33",
    border: "#38414a",
    text: "#b6c2cf",
    muted: "#8c9bab",
    accent: "#579dff",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: "jira-light",
    name: "Jira Light Classic",
    bg: "#f4f5f7",
    surface: "#ffffff",
    card: "#ffffff",
    border: "#dfe1e6",
    text: "#172b4d",
    muted: "#5e6c84",
    accent: "#0052cc",
    gradient: "from-blue-600 to-blue-500"
  },
  {
    id: "atlassian-classic",
    name: "Atlassian Classic Blue",
    bg: "#0747a6",
    surface: "#0052cc",
    card: "#172b4d",
    border: "#2684ff",
    text: "#ffffff",
    muted: "#deebff",
    accent: "#2684ff",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: "jira-software",
    name: "Software Deep Navy",
    bg: "#091e42",
    surface: "#101214",
    card: "#1d2125",
    border: "#2c333a",
    text: "#9fadbc",
    muted: "#626f86",
    accent: "#388bff",
    gradient: "from-indigo-600 to-blue-500"
  },
  {
    id: "jira-ops",
    name: "Jira Operations (Charcoal)",
    bg: "#121212",
    surface: "#1e1e1e",
    card: "#242424",
    border: "#333333",
    text: "#e0e0e0",
    muted: "#aaaaaa",
    accent: "#00c7be",
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    id: "kanban-emerald",
    name: "Kanban Board Emerald",
    bg: "#06281e",
    surface: "#093629",
    card: "#0d4735",
    border: "#1b6a52",
    text: "#e3fcef",
    muted: "#abf5d1",
    accent: "#00875a",
    gradient: "from-emerald-600 to-teal-500"
  },
  {
    id: "backlog-purple",
    name: "Backlog Amethyst",
    bg: "#200d3b",
    surface: "#2c1052",
    card: "#38186a",
    border: "#52258d",
    text: "#f3f0ff",
    muted: "#d8d0ff",
    accent: "#8777d9",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    id: "sprint-amber",
    name: "Sprint Burnt Orange",
    bg: "#3b1705",
    surface: "#522107",
    card: "#6b2c0a",
    border: "#8f3e13",
    text: "#fff7ec",
    muted: "#fedec8",
    accent: "#ff8b00",
    gradient: "from-amber-600 to-orange-500"
  },
  {
    id: "bug-tracker-red",
    name: "Bug Tracker Crimson",
    bg: "#3b0a0a",
    surface: "#520e0e",
    card: "#691414",
    border: "#8f2222",
    text: "#ffeded",
    muted: "#ffbdbd",
    accent: "#de350b",
    gradient: "from-red-600 to-rose-600"
  },
  {
    id: "roadmap-cyan",
    name: "Roadmap Cyan",
    bg: "#062230",
    surface: "#093245",
    card: "#0d445c",
    border: "#186385",
    text: "#e6fcff",
    muted: "#9bf0ff",
    accent: "#00b8d9",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "confluence-teal",
    name: "Confluence Teal",
    bg: "#032d36",
    surface: "#022026",
    card: "#08333e",
    border: "#0f766e",
    text: "#f0fdf4",
    muted: "#99f6e4",
    accent: "#00a3bf",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    id: "bitbucket-slate",
    name: "Bitbucket Slate",
    bg: "#091e42",
    surface: "#1d2125",
    card: "#22272b",
    border: "#44546f",
    text: "#c3c7cb",
    muted: "#9fadbc",
    accent: "#2684ff",
    gradient: "from-slate-600 to-blue-600"
  },
  {
    id: "trello-sky",
    name: "Trello Sky Blue",
    bg: "#003b6f",
    surface: "#0055a5",
    card: "#006dd9",
    border: "#2684ff",
    text: "#ffffff",
    muted: "#b3d4ff",
    accent: "#0079bf",
    gradient: "from-sky-500 to-blue-600"
  },
  {
    id: "high-contrast",
    name: "High Contrast Accessibility",
    bg: "#000000",
    surface: "#121212",
    card: "#1a1a1a",
    border: "#ffffff",
    text: "#ffffff",
    muted: "#ffff00",
    accent: "#ffff00",
    gradient: "from-yellow-400 to-white"
  },
  {
    id: "executive-gold",
    name: "Executive Gold & Onyx",
    bg: "#ecdada",
    surface: "#1c1c1c",
    card: "#141414",
    border: "#3d3d3d",
    text: "#aa891c",
    muted: "#e4e1d6",
    accent: "#ad9440",
    gradient: "from-amber-600 to-yellow-600"
  },
  {
    id: "cyberpunk-ops",
    name: "Cyberpunk Terminal",
    bg: "#0d0208",
    surface: "#190314",
    card: "#af0b8c",
    border: "#4a0a3c",
    text: "#0000",
    muted: "#ff007f",
    accent: "#00ff",
    gradient: "from-emerald-400 to-dark-500"
  },
  {
    id: "clean-minimalist",
    name: "Clean Minimalist Zinc",
    bg: "#fafafa",
    surface: "#ffffff",
    card: "#ffffff",
    border: "#e4e4e7",
    text: "#27272a",
    muted: "#71717a",
    accent: "#18181b",
    gradient: "from-zinc-800 to-zinc-600"
  },
  {
    id: "forest-ops",
    name: "Forest Operations",
    bg: "#142114",
    surface: "#1c2e1c",
    card: "#253b25",
    border: "#385438",
    text: "#e8f0e8",
    muted: "#a3c2a3",
    accent: "#52b788",
    gradient: "from-green-600 to-emerald-500"
  },
  {
    id: "sunset-agile",
    name: "Sunset Agile",
    bg: "#2b1322",
    surface: "#3d1c32",
    card: "#4e2541",
    border: "#73385f",
    text: "#fcebf6",
    muted: "#f4b6dc",
    accent: "#e53e82",
    gradient: "from-pink-500 to-purple-600"
  },
  {
    id: "deep-space-node",
    name: "Deep Space DevOps",
    bg: "#0b0e14",
    surface: "#131822",
    card: "#1a2233",
    border: "#293548",
    text: "#c6d0f5",
    muted: "#838ba1",
    accent: "#8caaee",
    gradient: "from-indigo-500 to-violet-500"
  },
  {
    id: "marigold-luxury",
    name: "Marigold & Diamonds Signature",
    bg: "#0B3D34",       // Deep luxury night base
    surface: "#111827",  // Dark slate surface container
    card: "#161E2E",     // Rich card container background
    border: "#D4AF37",   // Marigold / Gold primary border accent
    text: "#31302C",     // Crisp white/ivory text
    muted: "#E5C558",    // Soft warm marigold gold muted text
    accent: " #D4AF37",   // Brilliant Marigold gold highlight
    gradient: "from-[#D4AF37] via-[#F3E066] to-[#E8B4B8]"
  }
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("jira_app_theme_id");
    return THEMES.find((t) => t.id === saved) || THEMES[0];
  });

  // Fetch saved global theme from public MongoDB endpoint on initial mount (works for all devices & guests)
  const fetchBackendTheme = useCallback(async () => {
    try {
      const response = await api.get("/auth/theme/public");
      const themeId = response.data?.themePreference;
      if (themeId) {
        const found = THEMES.find((t) => t.id === themeId);
        if (found) {
          setCurrentTheme(found);
          localStorage.setItem("jira_app_theme_id", found.id);
        }
      }
    } catch {
      // Fallback silently to localStorage or default if endpoint is unavailable
    }
  }, []);

  useEffect(() => {
    fetchBackendTheme();
  }, [fetchBackendTheme]);

  // Inject CSS Variables dynamically into DOM Root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--jira-bg", currentTheme.bg);
    root.style.setProperty("--jira-surface", currentTheme.surface);
    root.style.setProperty("--jira-card", currentTheme.card);
    root.style.setProperty("--jira-border", currentTheme.border);
    root.style.setProperty("--jira-text", currentTheme.text);
    root.style.setProperty("--jira-muted", currentTheme.muted);
    root.style.setProperty("--jira-accent", currentTheme.accent);
  }, [currentTheme]);

  // Set local state, update localStorage, and persist setting to MongoDB database (Admin only)
  const setTheme = async (themeId) => {
    const found = THEMES.find((t) => t.id === themeId);
    if (!found) return;

    setCurrentTheme(found);
    localStorage.setItem("jira_app_theme_id", found.id);

    try {
      await api.put("/auth/theme", { themePreference: found.id });
    } catch (err) {
      console.error("Could not sync theme to MongoDB database:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}