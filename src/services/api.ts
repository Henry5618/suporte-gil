import axios, { AxiosError } from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "auth-token";

export const tokenStorage = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => typeof window !== "undefined" && localStorage.setItem(TOKEN_KEY, t),
  clear: () => typeof window !== "undefined" && localStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ detail?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      tokenStorage.clear();
      // só redireciona se não estiver já no login
      if (!window.location.pathname.includes("login")) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(err: unknown, fallback = "Erro na requisição"): string {
  const e = err as AxiosError<{ detail?: string }>;
  return e?.response?.data?.detail || e?.message || fallback;
}
