import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import ThemeToggle, {
  getStoredTheme,
  setStoredTheme,
  applyThemeClass,
} from "../components/ThemeToggle";
import { useAuthUser } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [dark, setDark] = useState(() => {
    const s = getStoredTheme();
    if (s === "dark") return true;
    if (s === "light") return false;
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    applyThemeClass(dark);
    setStoredTheme(dark);
  }, [dark]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
      toast.success("Anda telah keluar");
      navigate("/");
    } catch {
      toast.success("Anda telah keluar");
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <div className="min-w-0 max-w-full pt-0.5 sm:pt-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Dashboard
            </p>
            <h1 className="text-lg font-bold leading-snug sm:text-xl">Selamat datang kembali</h1>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <ThemeToggle
              dark={dark}
              onToggle={() => setDark((d) => !d)}
              floating={false}
            />
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex min-h-[48px] min-w-0 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:min-h-0 sm:flex-initial sm:text-sm"
            >
              {loggingOut && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-10">
        {user && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6 ${
                !(user.username != null && user.username !== "") ? "sm:col-span-2" : ""
              }`}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="mt-1 break-words text-sm font-medium sm:text-base">{user.email}</p>
            </div>
            {user.username != null && user.username !== "" && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Username</p>
                <p className="mt-1 break-words font-medium">{user.username}</p>
              </div>
            )}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-violet-950/40 sm:col-span-2 sm:rounded-2xl sm:p-6">
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                Sesi aktif
              </p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-800/90 dark:text-indigo-300/90">
                Anda terautentikasi dengan JWT yang disimpan pada cookie HttpOnly.
                Halaman ini hanya dapat diakses setelah login yang valid.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
