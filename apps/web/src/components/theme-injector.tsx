"use client";

import { useEffect } from "react";

function darkenColor(hex: string, percent: number): string {
  try {
    const cleanHex = hex.replace("#", "");
    let num = parseInt(cleanHex, 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;

    R = R < 0 ? 0 : R > 255 ? 255 : R;
    G = G < 0 ? 0 : G > 255 ? 255 : G;
    B = B < 0 ? 0 : B > 255 ? 255 : B;

    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  } catch (e) {
    return hex;
  }
}

export function ThemeInjector() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("hrms_frontend_config");
    if (!stored) return;

    try {
      const config = JSON.parse(stored);
      const {
        primaryColor = "#4f46e5",
        secondaryColor = "#0ea5e9",
        bgColor = "#f8fafc",
        textColor = "#0f172a",
        fontFamily = "Outfit"
      } = config;

      // Darken primary for hover effects
      const primaryHover = darkenColor(primaryColor, 10);
      const secondaryHover = darkenColor(secondaryColor, 10);

      // Create style element
      const styleId = "dynamic-theme-overrides";
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      // Font loader logic
      const fontId = `font-${fontFamily.replace(/\s+/g, "-")}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        
        let fontUrl = "";
        if (fontFamily === "Inter") {
          fontUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap";
        } else if (fontFamily === "Outfit") {
          fontUrl = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap";
        } else if (fontFamily === "Roboto") {
          fontUrl = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap";
        } else if (fontFamily === "Playfair Display") {
          fontUrl = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700;900&display=swap";
        } else if (fontFamily === "Fira Code") {
          fontUrl = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap";
        }

        if (fontUrl) {
          link.href = fontUrl;
          document.head.appendChild(link);
        }
      }

      const fontCssFamily = fontFamily === "Fira Code" ? "monospace" : `'${fontFamily}', sans-serif`;

      styleEl.innerHTML = `
        :root {
          --theme-primary: ${primaryColor};
          --theme-primary-hover: ${primaryHover};
          --theme-secondary: ${secondaryColor};
          --theme-secondary-hover: ${secondaryHover};
          --theme-bg: ${bgColor};
          --theme-text: ${textColor};
          --theme-font: ${fontCssFamily};
        }

        body {
          font-family: var(--theme-font) !important;
        }

        /* Override basic layout utilities */
        .theme-configured-bg {
          background-color: var(--theme-bg) !important;
        }
        .theme-configured-text {
          color: var(--theme-text) !important;
        }

        /* Indigo class overrides (the app's primary accent) */
        .bg-indigo-600, .bg-primary, .bg-indigo-700 {
          background-color: var(--theme-primary) !important;
        }
        .hover\\:bg-indigo-700:hover, .hover\\:bg-primary-hover:hover, .hover\\:bg-indigo-800:hover {
          background-color: var(--theme-primary-hover) !important;
        }
        .text-indigo-600, .text-primary, .text-indigo-700 {
          color: var(--theme-primary) !important;
        }
        .border-indigo-600, .border-primary, .border-indigo-200 {
          border-color: var(--theme-primary) !important;
        }
        
        /* Secondary color overrides */
        .bg-cyan-600, .bg-sky-500, .bg-sky-600 {
          background-color: var(--theme-secondary) !important;
        }
        .text-cyan-600, .text-sky-500, .text-sky-600, .text-sky-700 {
          color: var(--theme-secondary) !important;
        }
        
        /* Badge primary colors */
        .bg-indigo-50 {
          background-color: var(--theme-primary)10 !important;
          color: var(--theme-primary) !important;
        }
      `;
    } catch (e) {
      console.error("Error applying theme injection:", e);
    }
  }, []);

  return null;
}
