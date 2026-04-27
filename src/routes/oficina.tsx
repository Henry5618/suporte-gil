import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Wrench, ArrowRightCircle } from "lucide-react";
import { osOficinaMock, clientesMock, usuariosMock, equipamentosBkpMock } from "@/lib/mockData";
import { formatBRL, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import type { OSOficina, StatusOficina } from "@/lib/types";

export const Route = createFileRoute("/oficina")({
  head: () => ({ meta: [{ title: "Oficina — TechSuporte" }] }),
  component: OficinaPage,
});

const statusList: StatusOficina[] = ["Entrada registrada", "Em análise", "Aguardando aprovação", "Aguardando peça", "Em manutenção", "Reparado", "Finalizado", "Cancelado"];

function OficinaPage() {
  const [lista, setLista] = useState<OSOficina[]>(osOficinaMock);
  const [novo, setNovo] = useState(false);
  const [editar, setEditar] = useState<OSOficina | null>(null);

  const cli = (id: string) => clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—";
  const tec = (id?: string) => id ? usuariosMock.find(u => u.id === id)?.nome ?? "—" : "—";

  return (
    <div>
      <PageHeader
        title="Oficina / Equipamentos"
        description="Equipamentos de clientes em análise ou manutenção."
        action={<Button onClick={() => setNovo(true)}><Plus className="h-4 w-4 mr-2" /> Registrar entrada</Button>}
      />

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Código</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Equipamento</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Entrada</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Técnico oficina</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(o => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{o.codigo}</td>
                <td className="px-4 py-3">{cli(o.clienteId)}</td>
                <td className="px-4 py-3 hidden md:table-cell">{o.tipoEquipamento}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{formatDate(o.dataEntrada)}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{tec(o.tecnicoOficinaId)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => setEditar(o)}>Analisar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NovaEntrada open={novo} onOpenChange={setNovo} onSave={(o) => { setLista([o, ...lista]); toast.success("Entrada registrada"); }} />
      <AnaliseDialog os={editar} onClose={() => setEditar(null)} onSave={(o) => { setLista(lista.map(x => x.id === o.id ? o : x)); setEditar(null); toast.success("Análise atualizada"); }} />
    </div>
  );
}

function NovaEntrada({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (o: OSOficina) => void }) {
  const [form, setForm] = useState({
    clienteId: "", pessoaResponsavel: "", tecnicoQueTrouxeId: "", tipoEquipamento: "PC Desktop",
    estadoFisico: "Bom", acessorios: "", problemaRelatado: "", pcBkpDeixado: false, pcBkpId: "none",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId || !form.tecnicoQueTrouxeId || !form.problemaRelatado) {
      toast.error("Preencha cliente, técnico e problema relatado");
      return;
    }
    onSave({
      id: "o" + Date.now(),
      codigo: "OSO-" + String(Math.floor(Math.random() * 9000) + 1000),
      dataEntrada: new Date().toISOString(),
      status: "Entrada registrada",
      ...form,
      pcBkpId: form.pcBkpId === "none" ? undefined : form.pcBkpId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Registrar entrada de equipamento</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Label>Cliente *</Label>
            <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{clientesMock.map(c => <SelectItem key={c.id} value={c.id}>{c.nomeEmpresa}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Pessoa responsável</Label><Input value={form.pessoaResponsavel} onChange={(e) => setForm({ ...form, pessoaResponsavel: e.target.value })} /></div>
          <div><Label>Técnico que trouxe *</Label>
            <Select value={form.tecnicoQueTrouxeId} onValueChange={(v) => setForm({ ...form, tecnicoQueTrouxeId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{usuariosMock.filter(u => u.perfil === "tecnico").map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Tipo de equipamento</Label>
            <Select value={form.tipoEquipamento} onValueChange={(v) => setForm({ ...form, tipoEquipamento: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["PC Desktop", "Notebook", "Impressora", "Servidor", "Roteador"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Estado físico</Label>
            <Select value={form.estadoFisico} onValueChange={(v) => setForm({ ...form, estadoFisico: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Bom", "Avariado", "Sem tampa", "Quebrado"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Acessórios recebidos</Label><Input value={form.acessorios} onChange={(e) => setForm({ ...form, acessorios: e.target.value })} placeholder="Fonte, cabo, mouse..." /></div>
          <div className="sm:col-span-2"><Label>Problema relatado *</Label><Textarea rows={2} value={form.problemaRelatado} onChange={(e) => setForm({ ...form, problemaRelatado: e.target.value })} /></div>
          <div className="sm:col-span-2 flex items-center justify-between border border-border rounded-lg p-3">
            <Label>PC BKP deixado no cliente?</Label>
            <Switch checked={form.pcBkpDeixado} onCheckedChange={(v) => setForm({ ...form, pcBkpDeixado: v })} />
          </div>
          {form.pcBkpDeixado && (
            <div className="sm:col-span-2"><Label>Código do PC BKP</Label>
              <Select value={form.pcBkpId} onValueChange={(v) => setForm({ ...form, pcBkpId: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {equipamentosBkpMock.filter(b => b.status === "Disponível").map(b => <SelectItem key={b.id} value={b.id}>{b.codigo} — {b.marcaModelo}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Registrar entrada</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AnaliseDialog({ os, onClose, onSave }: { os: OSOficina | null; onClose: () => void; onSave: (o: OSOficina) => void }) {
  const [form, setForm] = useState<OSOficina | null>(null);
  if (os && !form) setForm(os);
  if (!os || !form) return null;

  const cliente = clientesMock.find(c => c.id === os.clienteId);

  const abrirOSDevolucao = () => {
    toast.success(`OS Externa criada para devolução em ${cliente?.nomeEmpresa}`);
    onClose();
  };

  return (
    <Dialog open={!!os} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> {os.codigo} — Análise da oficina</DialogTitle>
        </DialogHeader>
        <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-1 mb-4">
          <div><span className="text-muted-foreground">Cliente:</span> <strong>{cliente?.nomeEmpresa}</strong></div>
          <div><span className="text-muted-foreground">Equipamento:</span> {os.tipoEquipamento} — {os.estadoFisico}</div>
          <div><span className="text-muted-foreground">Problema:</span> {os.problemaRelatado}</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Técnico da oficina</Label>
            <Select value={form.tecnicoOficinaId ?? ""} onValueChange={(v) => setForm({ ...form, tecnicoOficinaId: v })}>
              <SelectTrigger><SelectValue placeholder="Atribuir" /></SelectTrigger>
              <SelectContent>{usuariosMock.filter(u => u.perfil === "oficina" || u.perfil === "tecnico").map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={(v: StatusOficina) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Diagnóstico</Label><Textarea rows={2} value={form.diagnostico ?? ""} onChange={(e) => setForm({ ...form, diagnostico: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Serviço necessário</Label><Textarea rows={2} value={form.servicoNecessario ?? ""} onChange={(e) => setForm({ ...form, servicoNecessario: e.target.value })} /></div>
          <div><Label>Peças necessárias</Label><Input value={form.pecasNecessarias ?? ""} onChange={(e) => setForm({ ...form, pecasNecessarias: e.target.value })} /></div>
          <div><Label>Valor de hardware (R$)</Label><Input type="number" min={0} step="0.01" value={form.valorHardware ?? 0} onChange={(e) => setForm({ ...form, valorHardware: Number(e.target.value) })} /></div>
          <div className="sm:col-span-2"><Label>Observações internas</Label><Textarea rows={2} value={form.observacoesInternas ?? ""} onChange={(e) => setForm({ ...form, observacoesInternas: e.target.value })} /></div>
        </div>
        {form.valorHardware ? <p className="text-sm text-success mt-3">Hardware: <strong>{formatBRL(form.valorHardware)}</strong></p> : null}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="secondary" onClick={abrirOSDevolucao}><ArrowRightCircle className="h-4 w-4 mr-2" /> Abrir OS de devolução</Button>
          <Button onClick={() => onSave(form)}>Salvar análise</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
