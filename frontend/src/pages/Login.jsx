import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { validateLoginForm, hasValidationErrors } from "../utils/validation";
import ThemeToggle, {
  getStoredTheme,
  setStoredTheme,
  applyThemeClass,
} from "../components/ThemeToggle";

/** Overlay loading minimal supaya animasi terlihat jelas walau API sangat cepat */
const MIN_LOGIN_OVERLAY_MS = 2600;

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [dark, setDark] = useState(() => {
    const s = getStoredTheme();
    if (s === "dark") return true;
    if (s === "light") return false;
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const navigate = useNavigate();

  useEffect(() => {
    applyThemeClass(dark);
    setStoredTheme(dark);
  }, [dark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errors = validateLoginForm(identifier, password);
    setFieldErrors(errors);
    if (hasValidationErrors(errors)) return;

    setLoading(true);
    const startedAt = Date.now();
    try {
      await api.post("/login", { identifier: identifier.trim(), password });
      const elapsed = Date.now() - startedAt;
      const pad = Math.max(0, MIN_LOGIN_OVERLAY_MS - elapsed);
      if (pad > 0) await waitMs(pad);
      toast.success("Login berhasil");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login gagal. Periksa koneksi dan coba lagi.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] min-h-screen w-full max-w-full flex-col overflow-x-hidden overflow-y-auto bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {loading && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-slate-900/55 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] backdrop-blur-md dark:bg-black/60 sm:gap-6 sm:px-6"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Memproses login"
        >
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
            <div
              className="absolute h-[4.5rem] w-[4.5rem] rounded-full border-[4px] border-indigo-400/30 dark:border-indigo-400/20 sm:h-[5.5rem] sm:w-[5.5rem] sm:border-[5px]"
              aria-hidden
            />
            <div
              className="absolute h-[4.5rem] w-[4.5rem] animate-spin rounded-full border-[4px] border-transparent border-t-indigo-400 border-r-violet-500 border-b-indigo-600 sm:h-[5.5rem] sm:w-[5.5rem] sm:border-[5px]"
              style={{ animationDuration: "1.65s" }}
              aria-hidden
            />
            <div
              className="absolute h-11 w-11 animate-spin rounded-full border-[3px] border-transparent border-b-violet-300 border-l-indigo-300 sm:h-14 sm:w-14"
              style={{ animationDuration: "2.6s", animationDirection: "reverse" }}
              aria-hidden
            />
          </div>
          <div className="max-w-[min(100%,20rem)] text-center">
            <p className="text-base font-bold tracking-tight text-white drop-shadow-md sm:text-lg">
              Memverifikasi akun…
            </p>
            <p className="mt-2 text-xs font-medium leading-snug text-indigo-100/90 sm:text-sm">
              Menghubungkan ke server dengan aman
            </p>
          </div>
          <div className="flex items-center gap-2" aria-hidden>
            <span className="h-3 w-3 animate-dot-bounce rounded-full bg-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.85)]" />
            <span
              className="h-3 w-3 animate-dot-bounce rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.85)]"
              style={{ animationDelay: "0.35s" }}
            />
            <span
              className="h-3 w-3 animate-dot-bounce rounded-full bg-indigo-200 shadow-[0_0_10px_rgba(199,210,254,0.85)]"
              style={{ animationDelay: "0.7s" }}
            />
          </div>
        </div>
      )}

      {/* background — dipotong overflow agar tidak memperlebar halaman */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(99,102,241,0.22),transparent)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(99,102,241,0.12),transparent)]"
          aria-hidden
        />
        <div
          className="absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10 sm:-left-24 sm:h-80 sm:w-80 md:-left-32 md:h-96 md:w-96"
          aria-hidden
        />
        <div
          className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10 sm:-right-20 sm:h-72 sm:w-72 md:-right-24 md:h-80 md:w-80"
          aria-hidden
        />
      </div>

      {/* Mobile / tablet (di bawah breakpoint lg): bilah atas. Desktop: header disembunyikan, pakai toggle mengambang. */}
      <header className="relative z-20 shrink-0 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-2.5 sm:px-5 sm:py-3 md:px-6 lg:px-8">
          <ThemeToggle
            dark={dark}
            onToggle={() => setDark((d) => !d)}
            floating={false}
          />
        </div>
      </header>

      {/* Desktop (lg+): pojok kanan atas seperti versi awal (fixed). */}
      <div className="hidden lg:contents">
        <ThemeToggle
          dark={dark}
          onToggle={() => setDark((d) => !d)}
          floating={true}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col sm:px-5 md:px-6 lg:px-8">
        <div className="flex w-full min-w-0 flex-1 flex-col justify-start gap-8 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-6 sm:px-0 sm:pb-10 sm:pt-8 lg:min-h-0 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:py-10 xl:gap-16">
          {/* branding */}
          <div className="mb-6 w-full min-w-0 max-w-xl lg:mb-0 lg:flex-1 lg:pr-4">
          <div className="box-border flex w-full min-w-0 max-w-full flex-wrap items-center gap-2.5 rounded-xl border border-indigo-200/70 bg-white/70 px-2.5 py-2 shadow-sm shadow-indigo-500/5 backdrop-blur-sm dark:border-indigo-500/20 dark:bg-slate-900/50 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 lg:inline-flex lg:w-auto">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-[0.65rem] font-bold tracking-wide text-white shadow-lg shadow-indigo-500/30 sm:h-12 sm:w-12 sm:rounded-xl sm:text-sm"
              aria-hidden
            >
              JT
            </span>
            <div className="min-w-0 flex-1 overflow-hidden text-left">
              <p className="break-words text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.08em] text-indigo-600 dark:text-indigo-400 sm:text-[0.65rem] sm:tracking-[0.14em] md:text-xs md:tracking-[0.18em]">
                PT. Javis Teknologi Albarokah
              </p>
              <p className="mt-0.5 break-words text-xs font-medium leading-snug text-slate-800 dark:text-slate-200 sm:text-sm">
                Portal akses internal
              </p>
            </div>
          </div>
          <h1 className="mt-5 max-w-full break-words text-[clamp(1.375rem,4.5vw+0.6rem,3rem)] font-bold leading-[1.2] tracking-tight text-slate-900 dark:text-white sm:mt-8 sm:leading-tight md:text-4xl lg:text-5xl">
            Masuk ke akun Anda
          </h1>
          <p className="mt-3 max-w-full text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-4 sm:max-w-md sm:text-base">
            Gunakan email dan password terdaftar untuk melanjutkan. Data masuk Anda
            ditangani dengan aman.
          </p>
          <ul className="mt-6 space-y-3 text-xs leading-snug text-slate-600 dark:text-slate-400 sm:mt-8 sm:text-sm sm:leading-normal">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                ✓
              </span>
              <span className="min-w-0">
                Form terproteksi dan halaman dashboard hanya untuk pengguna yang sah
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                ✓
              </span>
              <span className="min-w-0">
                Perlindungan tambahan dari percobaan login berulang
              </span>
            </li>
          </ul>
          </div>

          {/* card */}
          <div className="motion-safe:animate-fade-in-up w-full min-w-0 max-w-full shrink-0 sm:max-w-md lg:flex-1 lg:max-w-md">
          <div className="box-border w-full max-w-full rounded-xl border border-slate-200/80 bg-white/80 p-3.5 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:rounded-2xl sm:p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Login</h2>

            {serverError && (
              <div
                className="mt-4 break-words rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 sm:px-4 sm:py-3"
                role="alert"
              >
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:mt-5 sm:space-y-5" noValidate>
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {process.env.REACT_APP_DB_HAS_USERNAME === "true"
                    ? "Email atau username"
                    : "Email"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    className={`min-h-[48px] w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-base text-slate-900 placeholder-slate-400 outline-none ring-indigo-500/0 transition focus:ring-2 dark:bg-slate-950 dark:text-slate-100 sm:pr-4 ${
                      fieldErrors.identifier
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                        : "border-slate-200 focus:border-indigo-500 dark:border-slate-700"
                    }`}
                    placeholder={
                      process.env.REACT_APP_DB_HAS_USERNAME === "true"
                        ? "nama@mail.com atau username"
                        : "nama@mail.com"
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.identifier && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="status">
                    {fieldErrors.identifier}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    className={`min-h-[48px] w-full rounded-xl border bg-white py-3 pl-11 pr-14 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 dark:bg-slate-950 dark:text-slate-100 sm:pr-14 ${
                      fieldErrors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700"
                    }`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 flex h-11 min-h-[44px] w-11 min-w-[44px] -translate-y-1/2 touch-manipulation items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:right-2 sm:h-10 sm:min-h-0 sm:w-10 sm:min-w-0"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                    tabIndex={0}
                  >
                    {show ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="status">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 sm:text-sm ${
                  loading
                    ? "ring-2 ring-indigo-300/90 ring-offset-2 ring-offset-white dark:ring-indigo-400/80 dark:ring-offset-slate-900"
                    : ""
                }`}
              >
                {loading && (
                  <>
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full animate-login-shine bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      aria-hidden
                    />
                    <span
                      className="relative h-7 w-7 shrink-0 animate-spin rounded-full border-[3px] border-white/35 border-t-white"
                      style={{ animationDuration: "1.35s" }}
                      aria-hidden
                    />
                  </>
                )}
                <span className="relative">{loading ? "Memproses login…" : "Masuk"}</span>
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
