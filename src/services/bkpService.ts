import { api } from "./api";

export interface BKPApi {
  id: number; codigo: string; tipo: string; marca_modelo?: string | null;
  configuracao?: string | null; status: string;
  cliente_atual_id?: number | null; tecnico_responsavel_id?: number | null;
  data_saida?: string | null; data_prevista_retorno?: string | null;
  os_vinculada_id?: number | null; observacoes?: string | null;
}

export const bkpService = {
  list: () => api.get<BKPApi[]>("/equipamentos-bkp").then((r) => r.data),
  get: (id: number) => api.get<BKPApi>(`/equipamentos-bkp/${id}`).then((r) => r.data),
  create: (payload: Partial<BKPApi>) => api.post<BKPApi>("/equipamentos-bkp", payload).then((r) => r.data),
  update: (id: number, payload: Partial<BKPApi>) => api.put<BKPApi>(`/equipamentos-bkp/${id}`, payload).then((r) => r.data),
  setStatus: (id: number, status: string) => api.patch<BKPApi>(`/equipamentos-bkp/${id}/status`, null, { params: { status_: status } }).then((r) => r.data),
};
