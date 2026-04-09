const STORAGE_KEY = "login-app-theme";

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredTheme(isDark) {
  try {
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    /* ignore */
  }
}

export function applyThemeClass(isDark) {
  const root = document.documentElement;
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

const baseBtn =
  "flex touch-manipulation items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900/90 dark:text-amber-200 dark:hover:bg-slate-800";

/**
 * @param {boolean} floating — true = pojok layar (fixed). false = inline di header/kartu (tidak menutupi konten).
 */
export default function ThemeToggle({ dark, onToggle, floating = false }) {
  if (floating) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`${baseBtn} fixed z-50 h-11 min-h-[44px] w-11 min-w-[44px]`}
        style={{
          top: "max(0.75rem, env(safe-area-inset-top, 0px))",
          right: "max(0.75rem, env(safe-area-inset-right, 0px))",
        }}
        aria-label={dark ? "Mode terang" : "Mode gelap"}
      >
        <ToggleIcon dark={dark} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${baseBtn} h-10 min-h-[44px] w-10 min-w-[44px] shrink-0 sm:h-11 sm:w-11`}
      aria-label={dark ? "Mode terang" : "Mode gelap"}
    >
      <ToggleIcon dark={dark} />
    </button>
  );
}

function ToggleIcon({ dark }) {
  return dark ? (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3v1a8 8 0 1 0 8 8h1A9 9 0 0 1 12 3z" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zM5.64 5.64a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41zM18.36 5.64a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0zM12 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm7.07-3.07a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41zM6.34 17.66a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0zM4 11h1a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm15 0h1a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2z" />
    </svg>
  );
}
