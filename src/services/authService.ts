import { api, tokenStorage } from "./api";

export type Perfil = "ADMIN" | "GESTOR" | "TECNICO" | "TECNICO_OFICINA";

export interface UsuarioApi {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  criado_em: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UsuarioApi;
}

export const authService = {
  async login(email: string, senha: string): Promise<UsuarioApi> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, senha });
    tokenStorage.set(data.access_token);
    return data.user;
  },
  async me(): Promise<UsuarioApi> {
    const { data } = await api.get<UsuarioApi>("/auth/me");
    return data;
  },
  logout() {
    tokenStorage.clear();
  },
};
