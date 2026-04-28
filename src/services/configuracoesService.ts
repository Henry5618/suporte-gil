import { api } from "./api";

export interface ConfigComissaoApi {
  chave: string;
  valor: string;
  descricao?: string | null;
}

export const configuracoesService = {
  listComissoes: () => api.get<ConfigComissaoApi[]>("/configuracoes/comissoes").then((r) => r.data),
  updateComissoes: (itens: { chave: string; valor: number }[]) =>
    api.put<ConfigComissaoApi[]>("/configuracoes/comissoes", { itens }).then((r) => r.data),
};

export const usuariosService = {
  list: () => api.get("/usuarios").then((r) => r.data),
  create: (payload: { nome: string; email: string; perfil: string; senha: string }) =>
    api.post("/usuarios", payload).then((r) => r.data),
  update: (id: number, payload: Record<string, unknown>) => api.put(`/usuarios/${id}`, payload).then((r) => r.data),
  setStatus: (id: number, ativo: boolean) =>
    api.patch(`/usuarios/${id}/status`, null, { params: { ativo } }).then((r) => r.data),
};

export const categoriasService = {
  list: () => api.get<{ id: number; nome: string; ativo: boolean }[]>("/categorias").then((r) => r.data),
  create: (nome: string) => api.post("/categorias", { nome }).then((r) => r.data),
  update: (id: number, nome: string) => api.put(`/categorias/${id}`, { nome }).then((r) => r.data),
  setStatus: (id: number, ativo: boolean) =>
    api.patch(`/categorias/${id}/status`, null, { params: { ativo } }).then((r) => r.data),
};

export const uploadsService = {
  upload: async (arquivo: File, opts?: { os_id?: number; tipo?: "anexo" | "foto" | "assinatura" }) => {
    const fd = new FormData();
    fd.append("arquivo", arquivo);
    if (opts?.os_id !== undefined) fd.append("os_id", String(opts.os_id));
    if (opts?.tipo) fd.append("tipo", opts.tipo);
    const { data } = await api.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return data as { id: number; caminho: string; nome_arquivo: string; tipo: string };
  },
  url: (caminho: string) => `${api.defaults.baseURL}/uploads/${caminho}`,
};
