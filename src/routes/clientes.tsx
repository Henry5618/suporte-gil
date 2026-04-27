import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Phone, Mail, MapPin, Building2, FileText } from "lucide-react";
import { clientesMock, osInternasMock, osExternasMock, osOficinaMock, vendasMock, usuariosMock } from "@/lib/mockData";
import { formatBRL, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import type { Cliente } from "@/lib/types";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes — TechSuporte" }] }),
  component: ClientesPage,
});

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);
  const [busca, setBusca] = useState("");
  const [novo, setNovo] = useState(false);
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);

  const filtrados = clientes.filter(c =>
    c.nomeEmpresa.toLowerCase().includes(busca.toLowerCase()) ||
    c.documento.includes(busca) ||
    c.contatoPrincipal.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Cadastro e histórico de clientes atendidos."
        action={
          <Button onClick={() => setNovo(true)}>
            <Plus className="h-4 w-4 mr-2" /> Novo cliente
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, CNPJ ou contato..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Empresa</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Documento</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Contato</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Telefone</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Cidade</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.nomeEmpresa}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.documento}</td>
                  <td className="px-4 py-3">{c.contatoPrincipal}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.telefone}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.cidade}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelecionado(c)}>Ver histórico</Button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum cliente encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClienteForm open={novo} onOpenChange={setNovo} onSave={(c) => { setClientes([c, ...clientes]); toast.success("Cliente cadastrado"); }} />
      <ClienteHistorico cliente={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}

function ClienteForm({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (c: Cliente) => void }) {
  const [form, setForm] = useState({ nomeEmpresa: "", documento: "", contatoPrincipal: "", telefone: "", email: "", endereco: "", cidade: "", observacoes: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomeEmpresa || !form.contatoPrincipal || !form.telefone) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    onSave({ id: "c" + Date.now(), criadoEm: new Date().toISOString(), ...form });
    onOpenChange(false);
    setForm({ nomeEmpresa: "", documento: "", contatoPrincipal: "", telefone: "", email: "", endereco: "", cidade: "", observacoes: "" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Novo cliente</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Label>Nome da empresa *</Label><Input value={form.nomeEmpresa} onChange={(e) => setForm({ ...form, nomeEmpresa: e.target.value })} /></div>
          <div><Label>CNPJ / CPF</Label><Input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} /></div>
          <div><Label>Contato principal *</Label><Input value={form.contatoPrincipal} onChange={(e) => setForm({ ...form, contatoPrincipal: e.target.value })} /></div>
          <div><Label>Telefone / WhatsApp *</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
          <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Endereço</Label><Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
          <div><Label>Cidade</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ClienteHistorico({ cliente, onClose }: { cliente: Cliente | null; onClose: () => void }) {
  if (!cliente) return null;
  const internas = osInternasMock.filter(o => o.clienteId === cliente.id);
  const externas = osExternasMock.filter(o => o.clienteId === cliente.id);
  const oficina = osOficinaMock.filter(o => o.clienteId === cliente.id);
  const vendas = vendasMock.filter(v => v.clienteId === cliente.id);
  const tecnicos = new Set([...internas.map(i => i.tecnicoId), ...externas.map(e => e.tecnicoDesignadoId).filter(Boolean)]);

  return (
    <Dialog open={!!cliente} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> {cliente.nomeEmpresa}</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3 text-sm bg-muted/30 p-4 rounded-lg">
          <div><span className="text-muted-foreground">Doc:</span> {cliente.documento}</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {cliente.telefone}</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {cliente.email}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {cliente.endereco}, {cliente.cidade}</div>
        </div>

        <Tabs defaultValue="internas">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="internas">Internas ({internas.length})</TabsTrigger>
            <TabsTrigger value="externas">Externas ({externas.length})</TabsTrigger>
            <TabsTrigger value="oficina">Oficina ({oficina.length})</TabsTrigger>
            <TabsTrigger value="vendas">Vendas ({vendas.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="internas" className="space-y-2">
            {internas.map(o => (
              <div key={o.id} className="border border-border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{o.codigo} — {o.descricao}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(o.criadoEm)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
            {internas.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Sem registros</p>}
          </TabsContent>
          <TabsContent value="externas" className="space-y-2">
            {externas.map(o => (
              <div key={o.id} className="border border-border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{o.codigo} — {o.descricao}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(o.dataPrevista)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
            {externas.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Sem registros</p>}
          </TabsContent>
          <TabsContent value="oficina" className="space-y-2">
            {oficina.map(o => (
              <div key={o.id} className="border border-border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{o.codigo} — {o.tipoEquipamento}</div>
                  <div className="text-xs text-muted-foreground">Entrada: {formatDate(o.dataEntrada)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
            {oficina.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Sem registros</p>}
          </TabsContent>
          <TabsContent value="vendas" className="space-y-2">
            {vendas.map(v => (
              <div key={v.id} className="border border-border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{v.tipo} — {v.descricao}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(v.data)}</div>
                </div>
                <div className="font-semibold">{formatBRL(v.valor)}</div>
              </div>
            ))}
            {vendas.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Sem registros</p>}
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-border">
          <FileText className="h-3 w-3" /> Atendido por {tecnicos.size} técnico(s)
        </div>
      </DialogContent>
    </Dialog>
  );
}
