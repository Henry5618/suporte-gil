import { createContext, useContext, useState, type ReactNode } from "react";
import { usuariosMock } from "./mockData";
import type { Usuario, Perfil } from "./types";

interface AuthCtx {
  user: Usuario | null;
  login: (email: string, _senha: string) => boolean;
  logout: () => void;
  switchProfile: (perfil: Perfil) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("auth-user");
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (u: Usuario | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("auth-user", JSON.stringify(u));
      else localStorage.removeItem("auth-user");
    }
  };

  const login = (email: string, _senha: string) => {
    const found = usuariosMock.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      persist(found);
      return true;
    }
    return false;
  };

  const logout = () => persist(null);

  const switchProfile = (perfil: Perfil) => {
    const found = usuariosMock.find((u) => u.perfil === perfil);
    if (found) persist(found);
  };

  return <Ctx.Provider value={{ user, login, logout, switchProfile }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export function can(perfil: Perfil | undefined, action: string): boolean {
  if (!perfil) return false;
  if (perfil === "admin") return true;
  const map: Record<string, Perfil[]> = {
    "criar.os.interna": ["gestor", "tecnico"],
    "criar.os.externa": ["gestor", "tecnico"],
    "criar.os.oficina": ["gestor", "oficina"],
    "atribuir.tecnico": ["gestor"],
    "validar.os": ["gestor"],
    "ver.relatorios": ["gestor"],
    "gerenciar.usuarios": [],
    "gerenciar.config": ["gestor"],
    "ver.oficina": ["gestor", "oficina", "tecnico"],
    "atualizar.oficina": ["oficina", "tecnico"],
  };
  return map[action]?.includes(perfil) ?? true;
}
