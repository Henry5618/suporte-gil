import { api } from "./api";

export type TipoVendaApi = "CashBKP" | "VPN" | "Hardware" | "Instalacao" | "Outro";

export interface VendaApi {
  id: number; os_id?: number | null; cliente_id: number; tecnico_id?: number | null;
  tipo: TipoVendaApi; descricao?: string | null; valor: string; comissao: string;
  status: string; data: string;
}

export const vendasService = {
  list: (tipo?: TipoVendaApi) => api.get<VendaApi[]>("/vendas", { params: tipo ? { tipo } : undefined }).then((r) => r.data),
  create: (payload: Partial<VendaApi>) => api.post<VendaApi>("/vendas", payload).then((r) => r.data),
  update: (id: number, payload: Partial<VendaApi>) => api.put<VendaApi>(`/vendas/${id}`, payload).then((r) => r.data),
};
