import { api } from "./api";

export interface ClienteApi {
  id: number;
  nome_empresa: string;
  documento?: string | null;
  contato_principal?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  observacoes?: string | null;
  criado_em: string;
}

export const clientesService = {
  list: (q?: string) => api.get<ClienteApi[]>("/clientes", { params: q ? { q } : undefined }).then((r) => r.data),
  get: (id: number) => api.get<ClienteApi>(`/clientes/${id}`).then((r) => r.data),
  create: (payload: Partial<ClienteApi>) => api.post<ClienteApi>("/clientes", payload).then((r) => r.data),
  update: (id: number, payload: Partial<ClienteApi>) => api.put<ClienteApi>(`/clientes/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/clientes/${id}`).then(() => true),
};
