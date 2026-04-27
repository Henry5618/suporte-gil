import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { clientesMock, osInternasMock, usuariosMock } from "@/lib/mockData";
import { formatDate, formatDuration } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import type { OSInterna } from "@/lib/types";

export const Route = createFileRoute("/os-interna")({
  head: () => ({ meta: [{ title: "OS Interna / Remota — TechSuporte" }] }),
  component: OSInternaPage,
});

function OSInternaPage() {
  const { user } = useAuth();
  const [lista, setLista] = useState<OSInterna[]>(osInternasMock);
  const [novo, setNovo] = useState(false);
  const [filtros, setFiltros] = useState({ cliente: "all", tecnico: "all", status: "all", tipo: "all" });

  const filtrados = useMemo(() => lista.filter(o =>
    (filtros.cliente === "all" || o.clienteId === filtros.cliente) &&
    (filtros.tecnico === "all" || o.tecnicoId === filtros.tecnico) &&
    (filtros.status === "all" || o.status === filtros.status) &&
    (filtros.tipo === "all" || o.tipoAtendimento === filtros.tipo)
  ), [lista, filtros]);

  const clientesById = (id: string) => clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—";
  const tecById = (id: string) => usuariosMock.find(u => u.id === id)?.nome ?? "—";

  return (
    <div>
      <PageHeader
        title="OS Interna / Remota"
        description="Atendimentos por WhatsApp e telefone."
        action={<Button onClick={() => setNovo(true)}><Plus className="h-4 w-4 mr-2" /> Nova OS</Button>}
      />

      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={filtros.cliente} onValueChange={(v) => setFiltros({ ...filtros, cliente: v })}>
            <SelectTrigger><SelectValue placeholder="Cliente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clientesMock.map(c => <SelectItem key={c.id} value={c.id}>{c.nomeEmpresa}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtros.tecnico} onValueChange={(v) => setFiltros({ ...filtros, tecnico: v })}>
            <SelectTrigger><SelectValue placeholder="Técnico" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os técnicos</SelectItem>
              {usuariosMock.filter(u => u.perfil === "tecnico").map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtros.status} onValueChange={(v) => setFiltros({ ...filtros, status: v })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="Finalizada">Finalizada</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtros.tipo} onValueChange={(v) => setFiltros({ ...filtros, tipo: v })}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Telefone">Telefone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Código</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Técnico</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Tipo</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Descrição</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Tempo</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(o => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{o.codigo}</td>
                  <td className="px-4 py-3">{clientesById(o.clienteId)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{tecById(o.tecnicoId)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{o.tipoAtendimento}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{o.descricao}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{formatDuration(o.tempoMinutos)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{formatDate(o.criadoEm)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">Nenhuma OS encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <NovaOSInterna open={novo} onOpenChange={setNovo} onSave={(o) => { setLista([o, ...lista]); toast.success("OS interna registrada — comissão R$ 1,50"); }} tecnicoId={user?.id ?? "u3"} />
    </div>
  );
}

function NovaOSInterna({ open, onOpenChange, onSave, tecnicoId }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (o: OSInterna) => void; tecnicoId: string }) {
  const [form, setForm] = useState({
    clienteId: "", pessoaAtendida: "", tipoAtendimento: "WhatsApp" as "WhatsApp" | "Telefone",
    descricao: "", servicoRealizado: "", tempoMinutos: 30, observacoes: "", status: "Finalizada" as "Finalizada" | "Cancelada",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId || !form.pessoaAtendida || !form.descricao) {
      toast.error("Preencha cliente, pessoa atendida e descrição");
      return;
    }
    const agora = new Date();
    const inicio = new Date(agora.getTime() - form.tempoMinutos * 60000);
    onSave({
      id: "i" + Date.now(),
      codigo: "OSI-" + String(Math.floor(Math.random() * 9000) + 1000),
      tecnicoId,
      inicio: inicio.toISOString(),
      fim: agora.toISOString(),
      criadoEm: agora.toISOString(),
      ...form,
    });
    onOpenChange(false);
    setForm({ clienteId: "", pessoaAtendida: "", tipoAtendimento: "WhatsApp", descricao: "", servicoRealizado: "", tempoMinutos: 30, observacoes: "", status: "Finalizada" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nova OS Interna / Remota</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Cliente *</Label>
            <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {clientesMock.map(c => <SelectItem key={c.id} value={c.id}>{c.nomeEmpresa}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Pessoa atendida *</Label><Input value={form.pessoaAtendida} onChange={(e) => setForm({ ...form, pessoaAtendida: e.target.value })} /></div>
          <div>
            <Label>Tipo de atendimento</Label>
            <Select value={form.tipoAtendimento} onValueChange={(v: "WhatsApp" | "Telefone") => setForm({ ...form, tipoAtendimento: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Telefone">Telefone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Descrição do problema *</Label><Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Serviço realizado</Label><Textarea value={form.servicoRealizado} onChange={(e) => setForm({ ...form, servicoRealizado: e.target.value })} rows={3} /></div>
          <div><Label>Tempo (min)</Label><Input type="number" min={0} value={form.tempoMinutos} onChange={(e) => setForm({ ...form, tempoMinutos: Number(e.target.value) })} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v: "Finalizada" | "Cancelada") => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={2} /></div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar OS</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
