import { api } from "./api";

export interface OSOficinaApi {
  id: number; codigo: string; cliente_id: number; status: string; descricao?: string | null;
  servico_realizado?: string | null; criado_em: string;
}

export const oficinaService = {
  list: () => api.get<OSOficinaApi[]>("/oficina").then((r) => r.data),
  get: (id: number) => api.get<OSOficinaApi>(`/oficina/${id}`).then((r) => r.data),
  entrada: (payload: Record<string, unknown>) => api.post<OSOficinaApi>("/oficina/entrada", payload).then((r) => r.data),
  analise: (id: number, payload: Record<string, unknown>) => api.put<OSOficinaApi>(`/oficina/${id}/analise`, payload).then((r) => r.data),
  abrirDevolucao: (id: number, payload: Record<string, unknown>) =>
    api.post(`/oficina/${id}/abrir-os-devolucao`, payload).then((r) => r.data),
};
