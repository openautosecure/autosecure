export type AnimationType = "starfield" | "aurora" | "particles" | "rain" | "waves" | "none";

export type InterfaceFont =
  | "Inter" | "Manrope" | "Poppins" | "Space Grotesk" | "Outfit"
  | "Sora" | "Plus Jakarta Sans" | "DM Sans" | "Figtree"
  | "system-ui" | "serif";

export type MonoFont =
  | "JetBrains Mono" | "Fira Code" | "IBM Plex Mono"
  | "Roboto Mono" | "Source Code Pro" | "monospace";

export interface ThemeSettings {
  themeId: string;
  primaryHue: number;
  accentHue: number;
  saturation: number;
  bgLightness: number;
  interfaceFont: InterfaceFont;
  monoFont: MonoFont;
  textSize: number;
  animation: AnimationType;
}

export interface ThemePreset {
  id: string;
  name: string;
  primaryHue: number;
  accentHue: number;
  saturation: number;
  bgLightness: number;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "ocean",               name: "Ocean",               primaryHue: 200, accentHue: 183, saturation: 100, bgLightness: 12 },
  { id: "sunset",              name: "Sunset",              primaryHue: 25,  accentHue: 345, saturation: 100, bgLightness: 10 },
  { id: "void",                name: "Void",                primaryHue: 280, accentHue: 260, saturation: 100, bgLightness: 8  },
  { id: "emerald",             name: "Emerald",             primaryHue: 145, accentHue: 160, saturation: 100, bgLightness: 10 },
  { id: "cherry",              name: "Cherry",              primaryHue: 5,   accentHue: 330, saturation: 100, bgLightness: 10 },
  { id: "gold",                name: "Gold",                primaryHue: 50,  accentHue: 35,  saturation: 100, bgLightness: 10 },
  { id: "neon",                name: "Neon",                primaryHue: 295, accentHue: 140, saturation: 100, bgLightness: 8  },
  { id: "stealth",             name: "Stealth",             primaryHue: 240, accentHue: 200, saturation: 15,  bgLightness: 8  },
  { id: "rose-pine",           name: "Rosé Pine",           primaryHue: 320, accentHue: 280, saturation: 75,  bgLightness: 10 },
  { id: "catppuccin-mocha",    name: "Catppuccin Mocha",    primaryHue: 292, accentHue: 218, saturation: 80,  bgLightness: 8  },
  { id: "plain-dark",          name: "Plain Dark",          primaryHue: 285, accentHue: 285, saturation: 8,   bgLightness: 8  },
];

export const DEFAULT_SETTINGS: ThemeSettings = {
  themeId: "ocean",
  primaryHue: 200,
  accentHue: 183,
  saturation: 100,
  bgLightness: 12,
  interfaceFont: "Inter",
  monoFont: "JetBrains Mono",
  textSize: 100,
  animation: "starfield",
};

const STORAGE_KEY = "autosecure-theme";

export function loadSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(s: ThemeSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  applySettings(s);
}

const loadedFonts = new Set<string>();

function loadGoogleFont(font: string) {
  if (!font || ["system-ui", "serif", "monospace"].includes(font) || loadedFonts.has(font)) return;
  loadedFonts.add(font);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function applySettings(s: ThemeSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const sat = s.saturation / 100;
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const bgL = clamp(s.bgLightness * 0.013, 0.04, 0.5);

  const ph = s.primaryHue;
  const ah = s.accentHue;
  root.style.setProperty("--primary",       `oklch(0.7 ${(0.22 * sat).toFixed(3)} ${ph})`);
  root.style.setProperty("--primary-glow",  `oklch(0.78 ${(0.18 * sat).toFixed(3)} ${(ph + 15) % 360})`);
  root.style.setProperty("--accent",        `oklch(0.78 ${(0.16 * sat).toFixed(3)} ${ah})`);
  root.style.setProperty("--accent-glow",   `oklch(0.85 ${(0.14 * sat).toFixed(3)} ${ah})`);
  root.style.setProperty("--background",    `oklch(${bgL.toFixed(3)} ${(0.025 * sat).toFixed(3)} ${ph})`);
  root.style.setProperty("--card",          `oklch(${clamp(bgL + 0.05, 0, 1).toFixed(3)} ${(0.03 * sat).toFixed(3)} ${ph})`);
  root.style.setProperty("--muted",         `oklch(${clamp(bgL + 0.09, 0, 1).toFixed(3)} ${(0.025 * sat).toFixed(3)} ${ph})`);
  root.style.setProperty("--muted-foreground", `oklch(${clamp(bgL + 0.54, 0, 1).toFixed(3)} 0.02 ${ph})`);
  root.style.setProperty("--border",        `oklch(${clamp(bgL + 0.14, 0, 1).toFixed(3)} ${(0.04 * sat).toFixed(3)} ${ph} / 60%)`);
  root.style.setProperty("--shadow-glow",   `0 0 60px -10px oklch(0.7 ${(0.22 * sat).toFixed(3)} ${ph} / 60%)`);
  root.style.setProperty("--shadow-glow-accent", `0 0 60px -10px oklch(0.78 ${(0.16 * sat).toFixed(3)} ${ah} / 60%)`);
  root.style.setProperty("--gradient-hero", `linear-gradient(135deg, oklch(0.7 ${(0.22 * sat).toFixed(3)} ${ph}) 0%, oklch(0.78 ${(0.16 * sat).toFixed(3)} ${ah}) 100%)`);
  root.style.setProperty(
    "--gradient-text",
    `linear-gradient(90deg, oklch(0.78 ${(0.18 * sat).toFixed(3)} ${(ph + 15) % 360}), oklch(0.85 ${(0.14 * sat).toFixed(3)} ${ah}))`
  );
  root.style.setProperty(
    "--body-bg",
    `radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.35 ${(0.18 * sat).toFixed(3)} ${ph} / 35%), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, oklch(0.35 ${(0.15 * sat).toFixed(3)} ${ah} / 25%), transparent 60%)`
  );
  root.style.setProperty(
    "--gradient-radial",
    `radial-gradient(60% 50% at 50% 20%, oklch(0.35 ${(0.18 * sat).toFixed(3)} ${ph} / 35%) 0%, transparent 70%)`
  );

  const fontSans =
    s.interfaceFont === "system-ui" ? "system-ui, sans-serif"
    : s.interfaceFont === "serif"   ? "Georgia, serif"
    : `"${s.interfaceFont}", system-ui, sans-serif`;
  root.style.setProperty("--font-sans", fontSans);

  const fontMono =
    s.monoFont === "monospace" ? "monospace"
    : `"${s.monoFont}", monospace`;
  root.style.setProperty("--font-mono", fontMono);

  root.style.fontSize = `${s.textSize}%`;
  root.setAttribute("data-animation", s.animation);

  loadGoogleFont(s.interfaceFont);
  loadGoogleFont(s.monoFont);
}

export function applySettingsFromStorage() {
  applySettings(loadSettings());
}

export function previewColors(primaryHue: number, accentHue: number, sat: number) {
  const s = sat / 100;
  return {
    primary: `hsl(${primaryHue}, ${Math.round(75 * s)}%, 60%)`,
    accent:  `hsl(${accentHue},  ${Math.round(70 * s)}%, 65%)`,
  };
}
