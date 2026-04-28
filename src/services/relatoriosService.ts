import { api } from "./api";

export const relatoriosService = {
  vendasGerais: () => api.get<{ tipo: string; total: number }[]>("/relatorios/vendas-gerais").then((r) => r.data),
  horasPorTecnico: () => api.get<{ id: number; nome: string; interna_min: number; externa_min: number }[]>("/relatorios/horas-por-tecnico").then((r) => r.data),
  comissaoTecnico: () => api.get<{ id: number; nome: string; comissao: number }[]>("/relatorios/comissao-tecnico").then((r) => r.data),
  osPorCliente: () => api.get<{ id: number; nome: string; interna: number; externa: number; oficina: number }[]>("/relatorios/os-por-cliente").then((r) => r.data),
  equipamentosBkp: () => api.get<{ status: string; qtd: number }[]>("/relatorios/equipamentos-bkp").then((r) => r.data),
};
