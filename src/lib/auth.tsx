import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type Perfil as PerfilApi, type UsuarioApi } from "@/services/authService";

// Mantém compatibilidade com o restante do código existente
export type Perfil = "admin" | "gestor" | "tecnico" | "oficina";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  perfilApi: PerfilApi;
  ativo: boolean;
  criadoEm: string;
}

const perfilApiToLocal: Record<PerfilApi, Perfil> = {
  ADMIN: "admin",
  GESTOR: "gestor",
  TECNICO: "tecnico",
  TECNICO_OFICINA: "oficina",
};

function fromApi(u: UsuarioApi): Usuario {
  return {
    id: String(u.id),
    nome: u.nome,
    email: u.email,
    perfil: perfilApiToLocal[u.perfil],
    perfilApi: u.perfil,
    ativo: u.ativo,
    criadoEm: u.criado_em,
  };
}

interface AuthCtx {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  switchProfile: (_perfil: Perfil) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService
      .me()
      .then((u) => active && setUser(fromApi(u)))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const u = await authService.login(email, senha);
      setUser(fromApi(u));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Sem efeito agora — autenticação é real. Mantido para compatibilidade.
  const switchProfile = (_perfil: Perfil) => {};

  return <Ctx.Provider value={{ user, loading, login, logout, switchProfile }}>{children}</Ctx.Provider>;
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
    "criar.os.interna": ["gestor", "tecnico", "oficina"],
    "criar.os.externa": ["gestor", "tecnico", "oficina"],
    "criar.os.oficina": ["gestor", "oficina"],
    "atribuir.tecnico": ["gestor"],
    "validar.os": ["gestor"],
    "ver.relatorios": ["gestor"],
    "ver.vendas": ["gestor"],
    "gerenciar.usuarios": [],
    "gerenciar.config": [], // só admin
    "ver.oficina": ["gestor", "oficina"],
    "atualizar.oficina": ["oficina"],
    "ver.bkp": ["gestor", "oficina"],
  };
  return map[action]?.includes(perfil) ?? true;
}
