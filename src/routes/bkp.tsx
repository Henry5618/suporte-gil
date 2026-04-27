import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { equipamentosBkpMock, clientesMock, usuariosMock } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import type { EquipamentoBKP } from "@/lib/types";

export const Route = createFileRoute("/bkp")({
  head: () => ({ meta: [{ title: "Equipamentos BKP — TechSuporte" }] }),
  component: BKPPage,
});

function BKPPage() {
  const [lista, setLista] = useState<EquipamentoBKP[]>(equipamentosBkpMock);
  const [novo, setNovo] = useState(false);
  const cli = (id?: string) => id ? clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—" : "—";
  const tec = (id?: string) => id ? usuariosMock.find(u => u.id === id)?.nome ?? "—" : "—";

  return (
    <div>
      <PageHeader title="Equipamentos BKP" description="Computadores reserva da empresa." action={<Button onClick={() => setNovo(true)}><Plus className="h-4 w-4 mr-2" /> Cadastrar</Button>} />

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Código</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Tipo / Modelo</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Configuração</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Cliente atual</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Saída / Retorno</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(b => (
              <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono">{b.codigo}</td>
                <td className="px-4 py-3"><div className="font-medium">{b.tipo}</div><div className="text-xs text-muted-foreground">{b.marcaModelo}</div></td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.configuracao}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 hidden lg:table-cell">{cli(b.clienteAtualId)}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                  {b.dataSaida && <>Saída: {formatDate(b.dataSaida)}<br /></>}
                  {b.dataPrevistaRetorno && <>Retorno: {formatDate(b.dataPrevistaRetorno)}</>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NovoBKP open={novo} onOpenChange={setNovo} onSave={(b) => { setLista([b, ...lista]); toast.success("BKP cadastrado"); }} />
    </div>
  );
}

function NovoBKP({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (b: EquipamentoBKP) => void }) {
  const [form, setForm] = useState({ codigo: "", tipo: "PC Desktop", marcaModelo: "", configuracao: "", status: "Disponível" as EquipamentoBKP["status"], observacoes: "" });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo equipamento BKP</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.codigo) { toast.error("Informe o código"); return; } onSave({ id: "b" + Date.now(), ...form }); onOpenChange(false); }} className="grid sm:grid-cols-2 gap-3">
          <div><Label>Código *</Label><Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="BKP-06" /></div>
          <div><Label>Tipo</Label>
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["PC Desktop", "Notebook", "Servidor", "Outro"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Marca / Modelo</Label><Input value={form.marcaModelo} onChange={(e) => setForm({ ...form, marcaModelo: e.target.value })} /></div>
          <div className="sm:col-span-2"><Label>Configuração</Label><Input value={form.configuracao} onChange={(e) => setForm({ ...form, configuracao: e.target.value })} /></div>
          <div><Label>Status</Label>
            <Select value={form.status} onValueChange={(v: EquipamentoBKP["status"]) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Disponível", "Emprestado", "Manutenção", "Indisponível"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} /></div>
          <DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
