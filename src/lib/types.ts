export type Perfil = "admin" | "gestor" | "tecnico" | "oficina";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  criadoEm: string;
}

export interface Cliente {
  id: string;
  nomeEmpresa: string;
  documento: string;
  contatoPrincipal: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  observacoes?: string;
  criadoEm: string;
}

export type StatusInterna = "Finalizada" | "Cancelada";
export type StatusExterna =
  | "Aberta"
  | "Agendada"
  | "Atribuída"
  | "Em atendimento"
  | "Aguardando cliente"
  | "Aguardando peça"
  | "Finalizada pelo técnico"
  | "Validada pelo gestor"
  | "Cancelada";
export type StatusOficina =
  | "Entrada registrada"
  | "Em análise"
  | "Aguardando aprovação"
  | "Aguardando peça"
  | "Em manutenção"
  | "Reparado"
  | "Finalizado"
  | "Cancelado";
export type Prioridade = "Baixa" | "Normal" | "Alta" | "Urgente";

export interface OSInterna {
  id: string;
  codigo: string;
  clienteId: string;
  pessoaAtendida: string;
  tipoAtendimento: "WhatsApp" | "Telefone";
  tecnicoId: string;
  descricao: string;
  servicoRealizado: string;
  inicio: string;
  fim: string;
  tempoMinutos: number;
  status: StatusInterna;
  observacoes?: string;
  criadoEm: string;
}

export interface OSExterna {
  id: string;
  codigo: string;
  clienteId: string;
  contatoCliente: string;
  telefone: string;
  endereco: string;
  dataPrevista: string;
  horarioPrevisto: string;
  prioridade: Prioridade;
  tecnicoDesignadoId?: string;
  descricao: string;
  equipamentosNecessarios: string;
  observacoesInternas?: string;
  status: StatusExterna;
  inicioAtendimento?: string;
  fimAtendimento?: string;
  servicoRealizado?: string;
  problemasEncontrados?: string;
  solucaoAplicada?: string;
  equipamentoRetirado?: boolean;
  pcBkpDeixado?: boolean;
  pcBkpRecolhido?: boolean;
  pcBkpId?: string;
  vendaCashBkp?: number;
  vendaVpn?: number;
  vendaHardwareDescricao?: string;
  vendaHardwareValor?: number;
  nomeAssinante?: string;
  documentoCargo?: string;
  assinaturaUrl?: string;
  validadoPor?: string;
  observacaoValidacao?: string;
  criadoPor: string;
  criadoEm: string;
}

export interface OSOficina {
  id: string;
  codigo: string;
  clienteId: string;
  pessoaResponsavel: string;
  tecnicoQueTrouxeId: string;
  dataEntrada: string;
  tipoEquipamento: string;
  estadoFisico: string;
  acessorios: string;
  problemaRelatado: string;
  pcBkpDeixado: boolean;
  pcBkpId?: string;
  tecnicoOficinaId?: string;
  diagnostico?: string;
  servicoNecessario?: string;
  pecasNecessarias?: string;
  valorHardware?: number;
  observacoesInternas?: string;
  status: StatusOficina;
}

export interface EquipamentoBKP {
  id: string;
  codigo: string;
  tipo: string;
  marcaModelo: string;
  configuracao: string;
  status: "Disponível" | "Emprestado" | "Manutenção" | "Indisponível";
  clienteAtualId?: string;
  tecnicoResponsavelId?: string;
  dataSaida?: string;
  dataPrevistaRetorno?: string;
  osVinculadaId?: string;
  observacoes?: string;
}

export type TipoVenda = "CashBKP" | "VPN" | "Hardware" | "Outro";
export interface VendaAdicional {
  id: string;
  osId: string;
  clienteId: string;
  tecnicoId: string;
  tipo: TipoVenda;
  descricao: string;
  valor: number;
  status: "Lançada" | "Validada" | "Cancelada";
  data: string;
}
