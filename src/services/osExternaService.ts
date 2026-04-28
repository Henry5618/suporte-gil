import { api } from "./api";

export interface OSExternaApi {
  id: number;
  codigo: string;
  cliente_id: number;
  tecnico_id?: number | null;
  descricao?: string | null;
  servico_previsto?: string | null;
  servico_realizado?: string | null;
  status: string;
  inicio?: string | null;
  fim?: string | null;
  tempo_minutos: number;
  data_prevista?: string | null;
  horario_previsto?: string | null;
  prioridade?: string | null;
  contato_cliente?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  equipamentos_necessarios?: string | null;
  pc_bkp_deixado: boolean;
  pc_bkp_recolhido: boolean;
  pc_bkp_id?: number | null;
  nome_assinante?: string | null;
  assinatura_url?: string | null;
  validado_por_id?: number | null;
  validado_em?: string | null;
  criado_em: string;
}

export const osExternaService = {
  list: (status?: string) =>
    api.get<OSExternaApi[]>("/os-externas", { params: status ? { status_: status } : undefined }).then((r) => r.data),
  get: (id: number) => api.get<OSExternaApi>(`/os-externas/${id}`).then((r) => r.data),
  create: (payload: Partial<OSExternaApi> & { servico_previsto: string; cliente_id: number }) =>
    api.post<OSExternaApi>("/os-externas", payload).then((r) => r.data),
  update: (id: number, payload: Partial<OSExternaApi>) => api.put<OSExternaApi>(`/os-externas/${id}`, payload).then((r) => r.data),
  iniciar: (id: number) => api.patch<OSExternaApi>(`/os-externas/${id}/iniciar`).then((r) => r.data),
  finalizar: (id: number, payload: Record<string, unknown>) => api.patch<OSExternaApi>(`/os-externas/${id}/finalizar`, payload).then((r) => r.data),
  validar: (id: number, observacao_validacao?: string) =>
    api.patch<OSExternaApi>(`/os-externas/${id}/validar`, { observacao_validacao }).then((r) => r.data),
  validarLote: (ids: number[], observacao_validacao?: string) =>
    api.patch<{ validadas: number }>("/os-externas/validar-todas", { ids, observacao_validacao }).then((r) => r.data),
  reabrir: (id: number) => api.patch<OSExternaApi>(`/os-externas/${id}/reabrir`).then((r) => r.data),
};

export const muralService = {
  doTecnico: () => api.get<OSExternaApi[]>("/mural/tecnico").then((r) => r.data),
  doGestor: () => api.get<OSExternaApi[]>("/mural/gestor").then((r) => r.data),
};
