import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Eye, ShieldCheck, Play } from "lucide-react";
import { clientesMock, osExternasMock, usuariosMock } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import type { OSExterna, Prioridade, StatusExterna } from "@/lib/types";

export const Route = createFileRoute("/os-externa")({
  head: () => ({ meta: [{ title: "OS Externa — TechSuporte" }] }),
  component: OSExternaPage,
});

const prioridades: Prioridade[] = ["Baixa", "Normal", "Alta", "Urgente"];
const statusList: StatusExterna[] = ["Aberta", "Agendada", "Atribuída", "Em atendimento", "Aguardando cliente", "Aguardando peça", "Finalizada pelo técnico", "Validada pelo gestor", "Cancelada"];

function OSExternaPage() {
  const { user } = useAuth();
  const [lista, setLista] = useState<OSExterna[]>(osExternasMock);
  const [novo, setNovo] = useState(false);
  const [validar, setValidar] = useState<OSExterna | null>(null);
  const [filtros, setFiltros] = useState({ cliente: "all", tecnico: "all", status: "all", prioridade: "all" });

  const filtrados = useMemo(() => lista.filter(o =>
    (filtros.cliente === "all" || o.clienteId === filtros.cliente) &&
    (filtros.tecnico === "all" || o.tecnicoDesignadoId === filtros.tecnico) &&
    (filtros.status === "all" || o.status === filtros.status) &&
    (filtros.prioridade === "all" || o.prioridade === filtros.prioridade)
  ), [lista, filtros]);

  const cli = (id: string) => clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—";
  const tec = (id?: string) => id ? usuariosMock.find(u => u.id === id)?.nome ?? "—" : "—";

  const validarOS = (o: OSExterna) => {
    setLista(lista.map(x => x.id === o.id ? { ...x, status: "Validada pelo gestor", validadoPor: user?.id } : x));
    setValidar(null);
    toast.success("OS validada — comissão R$ 5,00 liberada");
  };

  return (
    <div>
      <PageHeader
        title="OS Externa"
        description="Atendimentos no cliente — agendamento, execução e validação."
        action={<Button onClick={() => setNovo(true)}><Plus className="h-4 w-4 mr-2" /> Nova OS Externa</Button>}
      />

      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={filtros.cliente} onValueChange={(v) => setFiltros({ ...filtros, cliente: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clientesMock.map(c => <SelectItem key={c.id} value={c.id}>{c.nomeEmpresa}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtros.tecnico} onValueChange={(v) => setFiltros({ ...filtros, tecnico: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os técnicos</SelectItem>
              {usuariosMock.filter(u => u.perfil === "tecnico").map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtros.status} onValueChange={(v) => setFiltros({ ...filtros, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtros.prioridade} onValueChange={(v) => setFiltros({ ...filtros, prioridade: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas prioridades</SelectItem>
              {prioridades.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Data prev.</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Prioridade</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(o => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{o.codigo}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{cli(o.clienteId)}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{o.descricao}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{tec(o.tecnicoDesignadoId)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{formatDate(o.dataPrevista)} <span className="text-xs text-muted-foreground">{o.horarioPrevisto}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><StatusBadge status={o.prioridade} /></td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {o.status === "Finalizada pelo técnico" ? (
                      <Button size="sm" onClick={() => setValidar(o)}><ShieldCheck className="h-3.5 w-3.5 mr-1" /> Validar</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setValidar(o)}><Eye className="h-3.5 w-3.5 mr-1" /> Ver</Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nenhuma OS encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <NovaOSExterna open={novo} onOpenChange={setNovo} onSave={(o) => { setLista([o, ...lista]); toast.success("OS Externa criada"); }} criadoPor={user?.id ?? ""} />
      <DetalhesOS os={validar} onClose={() => setValidar(null)} onValidar={validarOS} />
    </div>
  );
}

function NovaOSExterna({ open, onOpenChange, onSave, criadoPor }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (o: OSExterna) => void; criadoPor: string }) {
  const [form, setForm] = useState({
    clienteId: "", contatoCliente: "", telefone: "", endereco: "", dataPrevista: "", horarioPrevisto: "Manhã",
    prioridade: "Normal" as Prioridade, tecnicoDesignadoId: "none", descricao: "", equipamentosNecessarios: "", observacoesInternas: "",
  });

  const onCli = (v: string) => {
    const c = clientesMock.find(x => x.id === v);
    setForm({ ...form, clienteId: v, endereco: c?.endereco ?? "", telefone: c?.telefone ?? "", contatoCliente: c?.contatoPrincipal ?? "" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId || !form.descricao || !form.dataPrevista) {
      toast.error("Preencha cliente, descrição e data prevista");
      return;
    }
    const status: StatusExterna = form.tecnicoDesignadoId !== "none" ? "Atribuída" : "Aberta";
    onSave({
      id: "e" + Date.now(),
      codigo: "OSE-" + String(Math.floor(Math.random() * 9000) + 1000),
      criadoPor,
      criadoEm: new Date().toISOString(),
      status,
      ...form,
      tecnicoDesignadoId: form.tecnicoDesignadoId === "none" ? undefined : form.tecnicoDesignadoId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nova OS Externa</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Cliente *</Label>
            <Select value={form.clienteId} onValueChange={onCli}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{clientesMock.map(c => <SelectItem key={c.id} value={c.id}>{c.nomeEmpresa}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Contato</Label><Input value={form.contatoCliente} onChange={(e) => setForm({ ...form, contatoCliente: e.target.value })} /></div>
          <div><Label>Telefone / WhatsApp</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Endereço</Label><Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
          <div><Label>Data prevista *</Label><Input type="date" value={form.dataPrevista} onChange={(e) => setForm({ ...form, dataPrevista: e.target.value })} /></div>
          <div><Label>Horário</Label><Input value={form.horarioPrevisto} onChange={(e) => setForm({ ...form, horarioPrevisto: e.target.value })} placeholder="Manhã, Tarde, 14:00" /></div>
          <div>
            <Label>Prioridade</Label>
            <Select value={form.prioridade} onValueChange={(v: Prioridade) => setForm({ ...form, prioridade: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{prioridades.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Técnico designado</Label>
            <Select value={form.tecnicoDesignadoId} onValueChange={(v) => setForm({ ...form, tecnicoDesignadoId: v })}>
              <SelectTrigger><SelectValue placeholder="Atribuir depois" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Atribuir depois —</SelectItem>
                {usuariosMock.filter(u => u.perfil === "tecnico").map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Descrição do problema *</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
          <div className="sm:col-span-2"><Label>Equipamentos necessários</Label><Input value={form.equipamentosNecessarios} onChange={(e) => setForm({ ...form, equipamentosNecessarios: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Observações internas</Label><Textarea value={form.observacoesInternas} onChange={(e) => setForm({ ...form, observacoesInternas: e.target.value })} rows={2} /></div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Criar OS</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DetalhesOS({ os, onClose, onValidar }: { os: OSExterna | null; onClose: () => void; onValidar: (o: OSExterna) => void }) {
  if (!os) return null;
  const cli = clientesMock.find(c => c.id === os.clienteId);
  const tec = usuariosMock.find(u => u.id === os.tecnicoDesignadoId);
  const podeValidar = os.status === "Finalizada pelo técnico";
  return (
    <Dialog open={!!os} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{os.codigo} <StatusBadge status={os.status} /></DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <Section title="Cliente">
            <Field label="Empresa" value={cli?.nomeEmpresa} />
            <Field label="Contato" value={os.contatoCliente} />
            <Field label="Telefone" value={os.telefone} />
            <Field label="Endereço" value={os.endereco} />
          </Section>
          <Section title="Atendimento">
            <Field label="Técnico" value={tec?.nome} />
            <Field label="Data prevista" value={`${formatDate(os.dataPrevista)} — ${os.horarioPrevisto}`} />
            <Field label="Prioridade" value={os.prioridade} />
            <Field label="Equipamentos" value={os.equipamentosNecessarios} />
          </Section>
          <Section title="Descrição">
            <p className="text-sm">{os.descricao}</p>
          </Section>
          {os.servicoRealizado && (
            <Section title="Execução">
              <Field label="Serviço realizado" value={os.servicoRealizado} />
              <Field label="Solução" value={os.solucaoAplicada} />
              {os.vendaCashBkp && <Field label="CashBKP" value={`R$ ${os.vendaCashBkp.toFixed(2)}`} />}
              {os.vendaVpn && <Field label="VPN" value={`R$ ${os.vendaVpn.toFixed(2)}`} />}
              {os.assinaturaUrl && <div><Label>Assinatura</Label><img src={os.assinaturaUrl} alt="Assinatura" className="border border-border rounded mt-1 max-h-24 bg-white" /></div>}
            </Section>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          {podeValidar && <Button onClick={() => onValidar(os)}><ShieldCheck className="h-4 w-4 mr-2" /> Validar OS</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{title}</div>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">{children}</div>
    </div>
  );
}
function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>;
}
