import type {
  Cliente,
  EquipamentoBKP,
  OSExterna,
  OSInterna,
  OSOficina,
  Usuario,
  VendaAdicional,
} from "./types";

export const usuariosMock: Usuario[] = [
  { id: "u1", nome: "Carlos Admin", email: "admin@empresa.com", perfil: "admin", ativo: true, criadoEm: "2024-01-10" },
  { id: "u2", nome: "Mariana Gestora", email: "gestor@empresa.com", perfil: "gestor", ativo: true, criadoEm: "2024-02-01" },
  { id: "u3", nome: "João Técnico", email: "joao@empresa.com", perfil: "tecnico", ativo: true, criadoEm: "2024-03-15" },
  { id: "u4", nome: "Pedro Técnico", email: "pedro@empresa.com", perfil: "tecnico", ativo: true, criadoEm: "2024-03-20" },
  { id: "u5", nome: "Lucas Oficina", email: "oficina@empresa.com", perfil: "oficina", ativo: true, criadoEm: "2024-04-02" },
];

export const clientesMock: Cliente[] = [
  { id: "c1", nomeEmpresa: "Padaria Pão Quente Ltda", documento: "12.345.678/0001-90", contatoPrincipal: "Roberto Silva", telefone: "(11) 98765-4321", email: "contato@paoquente.com.br", endereco: "Rua das Flores, 123 - Centro", cidade: "São Paulo", observacoes: "Atendimento das 8h às 17h", criadoEm: "2024-05-10" },
  { id: "c2", nomeEmpresa: "Auto Mecânica Veloz", documento: "98.765.432/0001-12", contatoPrincipal: "Marcos Pereira", telefone: "(11) 91234-5678", email: "marcos@autoveloz.com", endereco: "Av. Industrial, 4500", cidade: "Guarulhos", criadoEm: "2024-06-22" },
  { id: "c3", nomeEmpresa: "Studio Beleza & Cia", documento: "11.222.333/0001-44", contatoPrincipal: "Ana Lima", telefone: "(11) 97777-8888", email: "ana@studiobeleza.com", endereco: "Rua Augusta, 890", cidade: "São Paulo", criadoEm: "2024-07-15" },
  { id: "c4", nomeEmpresa: "Construtora Horizonte", documento: "55.666.777/0001-88", contatoPrincipal: "José Oliveira", telefone: "(11) 95555-3322", email: "ti@horizonte.com", endereco: "Alameda Santos, 1500", cidade: "São Paulo", criadoEm: "2024-08-03" },
  { id: "c5", nomeEmpresa: "Mercado Bom Preço", documento: "33.444.555/0001-66", contatoPrincipal: "Sandra Costa", telefone: "(11) 94444-1100", email: "sandra@bompreco.com", endereco: "Rua do Comércio, 250", cidade: "Osasco", criadoEm: "2024-09-12" },
];

const today = new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };
const hoursAgo = (n: number) => { const d = new Date(today); d.setHours(d.getHours() - n); return iso(d); };
const daysAhead = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

export const osInternasMock: OSInterna[] = [
  { id: "i1", codigo: "OSI-0001", clienteId: "c1", pessoaAtendida: "Roberto", tipoAtendimento: "WhatsApp", tecnicoId: "u3", descricao: "Impressora não imprime", servicoRealizado: "Reinstalado driver de impressora e configurado fila padrão.", inicio: hoursAgo(3), fim: hoursAgo(2), tempoMinutos: 45, status: "Finalizada", criadoEm: hoursAgo(2) },
  { id: "i2", codigo: "OSI-0002", clienteId: "c2", pessoaAtendida: "Marcos", tipoAtendimento: "Telefone", tecnicoId: "u4", descricao: "Sistema travando", servicoRealizado: "Limpeza de cache, atualização do sistema operacional.", inicio: hoursAgo(5), fim: hoursAgo(4), tempoMinutos: 38, status: "Finalizada", criadoEm: hoursAgo(4) },
  { id: "i3", codigo: "OSI-0003", clienteId: "c3", pessoaAtendida: "Ana", tipoAtendimento: "WhatsApp", tecnicoId: "u3", descricao: "E-mail não envia", servicoRealizado: "Reconfigurado SMTP no Outlook.", inicio: daysAgo(1), fim: daysAgo(1), tempoMinutos: 25, status: "Finalizada", criadoEm: daysAgo(1) },
  { id: "i4", codigo: "OSI-0004", clienteId: "c5", pessoaAtendida: "Sandra", tipoAtendimento: "Telefone", tecnicoId: "u4", descricao: "Lentidão internet", servicoRealizado: "Reset de roteador e teste de velocidade.", inicio: daysAgo(2), fim: daysAgo(2), tempoMinutos: 30, status: "Finalizada", criadoEm: daysAgo(2) },
  { id: "i5", codigo: "OSI-0005", clienteId: "c1", pessoaAtendida: "Roberto", tipoAtendimento: "WhatsApp", tecnicoId: "u3", descricao: "Erro no PDV", servicoRealizado: "—", inicio: daysAgo(3), fim: daysAgo(3), tempoMinutos: 0, status: "Cancelada", observacoes: "Cliente resolveu sozinho.", criadoEm: daysAgo(3) },
];

export const osExternasMock: OSExterna[] = [
  { id: "e1", codigo: "OSE-0001", clienteId: "c4", contatoCliente: "José", telefone: "(11) 95555-3322", endereco: "Alameda Santos, 1500", dataPrevista: iso(today), horarioPrevisto: "Manhã", prioridade: "Alta", tecnicoDesignadoId: "u3", descricao: "Servidor não liga", equipamentosNecessarios: "PC BKP, cabos", status: "Atribuída", criadoPor: "u2", criadoEm: daysAgo(1) },
  { id: "e2", codigo: "OSE-0002", clienteId: "c2", contatoCliente: "Marcos", telefone: "(11) 91234-5678", endereco: "Av. Industrial, 4500", dataPrevista: iso(today), horarioPrevisto: "14:00", prioridade: "Normal", tecnicoDesignadoId: "u3", descricao: "Instalação de roteador novo", equipamentosNecessarios: "Roteador, cabo de rede", status: "Em atendimento", inicioAtendimento: hoursAgo(1), criadoPor: "u2", criadoEm: daysAgo(2) },
  { id: "e3", codigo: "OSE-0003", clienteId: "c3", contatoCliente: "Ana", telefone: "(11) 97777-8888", endereco: "Rua Augusta, 890", dataPrevista: daysAgo(1), horarioPrevisto: "Tarde", prioridade: "Normal", tecnicoDesignadoId: "u4", descricao: "Configuração de impressora de rede", equipamentosNecessarios: "Cabo USB", status: "Finalizada pelo técnico", inicioAtendimento: daysAgo(1), fimAtendimento: daysAgo(1), servicoRealizado: "Impressora configurada e testada em 3 estações.", solucaoAplicada: "Driver atualizado e IP fixo configurado.", vendaCashBkp: 30, criadoPor: "u4", criadoEm: daysAgo(2) },
  { id: "e4", codigo: "OSE-0004", clienteId: "c1", contatoCliente: "Roberto", telefone: "(11) 98765-4321", endereco: "Rua das Flores, 123", dataPrevista: daysAhead(1), horarioPrevisto: "Manhã", prioridade: "Urgente", descricao: "PDV não conecta no servidor", equipamentosNecessarios: "—", status: "Aberta", criadoPor: "u2", criadoEm: hoursAgo(4) },
  { id: "e5", codigo: "OSE-0005", clienteId: "c5", contatoCliente: "Sandra", telefone: "(11) 94444-1100", endereco: "Rua do Comércio, 250", dataPrevista: daysAgo(3), horarioPrevisto: "10:00", prioridade: "Normal", tecnicoDesignadoId: "u4", descricao: "Manutenção preventiva de 5 PCs", equipamentosNecessarios: "Kit limpeza, pasta térmica", status: "Validada pelo gestor", inicioAtendimento: daysAgo(3), fimAtendimento: daysAgo(3), servicoRealizado: "Limpeza geral e troca de pasta térmica.", validadoPor: "u2", criadoPor: "u2", criadoEm: daysAgo(5) },
];

export const osOficinaMock: OSOficina[] = [
  { id: "o1", codigo: "OSO-0001", clienteId: "c1", pessoaResponsavel: "Roberto", tecnicoQueTrouxeId: "u3", dataEntrada: daysAgo(2), tipoEquipamento: "PC Desktop", estadoFisico: "Bom", acessorios: "Fonte, cabo de força", problemaRelatado: "Não liga", pcBkpDeixado: true, pcBkpId: "b1", tecnicoOficinaId: "u5", diagnostico: "Fonte queimada", servicoNecessario: "Troca de fonte 500W", pecasNecessarias: "Fonte 500W reais", valorHardware: 280, status: "Aguardando peça" },
  { id: "o2", codigo: "OSO-0002", clienteId: "c3", pessoaResponsavel: "Ana", tecnicoQueTrouxeId: "u4", dataEntrada: daysAgo(5), tipoEquipamento: "Notebook", estadoFisico: "Avariado", acessorios: "Carregador", problemaRelatado: "Tela quebrada", pcBkpDeixado: false, tecnicoOficinaId: "u5", diagnostico: "Display LCD quebrado", servicoNecessario: "Troca de tela 14\"", pecasNecessarias: "Tela 14\" LED", valorHardware: 450, status: "Reparado" },
  { id: "o3", codigo: "OSO-0003", clienteId: "c2", pessoaResponsavel: "Marcos", tecnicoQueTrouxeId: "u3", dataEntrada: daysAgo(1), tipoEquipamento: "Impressora", estadoFisico: "Bom", acessorios: "Cabo USB", problemaRelatado: "Atolando papel", pcBkpDeixado: false, status: "Em análise" },
];

export const equipamentosBkpMock: EquipamentoBKP[] = [
  { id: "b1", codigo: "BKP-01", tipo: "PC Desktop", marcaModelo: "Dell Optiplex 3070", configuracao: "i5 / 8GB / SSD 240GB", status: "Emprestado", clienteAtualId: "c1", tecnicoResponsavelId: "u3", dataSaida: daysAgo(2), dataPrevistaRetorno: daysAhead(3), osVinculadaId: "o1" },
  { id: "b2", codigo: "BKP-02", tipo: "Notebook", marcaModelo: "Lenovo ThinkPad T480", configuracao: "i7 / 16GB / SSD 512GB", status: "Disponível" },
  { id: "b3", codigo: "BKP-03", tipo: "PC Desktop", marcaModelo: "HP ProDesk 400", configuracao: "i3 / 8GB / SSD 240GB", status: "Disponível" },
  { id: "b4", codigo: "BKP-04", tipo: "Notebook", marcaModelo: "Dell Latitude 5400", configuracao: "i5 / 8GB / SSD 256GB", status: "Manutenção" },
  { id: "b5", codigo: "BKP-05", tipo: "PC Desktop", marcaModelo: "Dell Optiplex 5070", configuracao: "i5 / 16GB / SSD 480GB", status: "Disponível" },
];

export const vendasMock: VendaAdicional[] = [
  { id: "v1", osId: "e3", clienteId: "c3", tecnicoId: "u4", tipo: "CashBKP", descricao: "CashBKP mensal", valor: 30, status: "Validada", data: daysAgo(1) },
  { id: "v2", osId: "e5", clienteId: "c5", tecnicoId: "u4", tipo: "VPN", descricao: "VPN corporativa", valor: 30, status: "Validada", data: daysAgo(3) },
  { id: "v3", osId: "e5", clienteId: "c5", tecnicoId: "u4", tipo: "Hardware", descricao: "Cabo de rede 5m x 3", valor: 75, status: "Validada", data: daysAgo(3) },
  { id: "v4", osId: "e2", clienteId: "c2", tecnicoId: "u3", tipo: "CashBKP", descricao: "CashBKP", valor: 20, status: "Lançada", data: hoursAgo(1) },
];

export const configComissaoMock = {
  osInterna: 1.5,
  osExterna: 5.0,
  cashBkpOpcoes: [20, 30],
  vpnPadrao: 30,
};
