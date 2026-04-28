import { api } from "./api";

export interface AnotacaoApi {
  id: number; titulo?: string | null; conteudo: string; autor_id?: number | null; criado_em: string;
}

export interface OSInternaApi {
  id: number;
  codigo: string;
  tipo: string;
  cliente_id: number;
  categoria_id?: number | null;
  tecnico_id?: number | null;
  pessoa_atendida?: string | null;
  tipo_atendimento?: string | null;
  descricao?: string | null;
  servico_realizado?: string | null;
  status: string;
  inicio?: string | null;
  fim?: string | null;
  tempo_minutos: number;
  observacoes?: string | null;
  criado_em: string;
  anotacoes: AnotacaoApi[];
}

export const osInternaService = {
  list: (status?: string) => api.get<OSInternaApi[]>("/os-internas", { params: status ? { status_: status } : undefined }).then((r) => r.data),
  get: (id: number) => api.get<OSInternaApi>(`/os-internas/${id}`).then((r) => r.data),
  create: (payload: Partial<OSInternaApi>) => api.post<OSInternaApi>("/os-internas", payload).then((r) => r.data),
  update: (id: number, payload: Partial<OSInternaApi>) => api.put<OSInternaApi>(`/os-internas/${id}`, payload).then((r) => r.data),
  setStatus: (id: number, status: string, observacao?: string) =>
    api.patch<OSInternaApi>(`/os-internas/${id}/status`, { status, observacao }).then((r) => r.data),
  addAnotacao: (id: number, titulo: string | undefined, conteudo: string) =>
    api.post<AnotacaoApi>(`/os-internas/${id}/anotacoes`, { titulo, conteudo }).then((r) => r.data),
  editAnotacao: (anotacaoId: number, titulo: string | undefined, conteudo: string) =>
    api.put<AnotacaoApi>(`/os-internas/anotacoes/${anotacaoId}`, { titulo, conteudo }).then((r) => r.data),
};
