import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { usuariosMock } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import type { Perfil, Usuario } from "@/lib/types";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — TechSuporte" }] }),
  component: UsuariosPage,
});

const perfilLabel: Record<Perfil, string> = { admin: "Administrador", gestor: "Gestor", tecnico: "Técnico", oficina: "Oficina" };

function UsuariosPage() {
  const [lista, setLista] = useState<Usuario[]>(usuariosMock);
  const [novo, setNovo] = useState(false);

  return (
    <div>
      <PageHeader title="Usuários" description="Equipe e permissões." action={<Button onClick={() => setNovo(true)}><Plus className="h-4 w-4 mr-2" /> Novo usuário</Button>} />

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">E-mail</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Perfil</th>
              <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Cadastro</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(u => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><StatusBadge status={perfilLabel[u.perfil]} tone="primary" /></td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{formatDate(u.criadoEm)}</td>
                <td className="px-4 py-3"><StatusBadge status={u.ativo ? "Ativo" : "Inativo"} tone={u.ativo ? "success" : "muted"} /></td>
                <td className="px-4 py-3 text-right"><Switch checked={u.ativo} onCheckedChange={(v) => setLista(lista.map(x => x.id === u.id ? { ...x, ativo: v } : x))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NovoUsuario open={novo} onOpenChange={setNovo} onSave={(u) => { setLista([u, ...lista]); toast.success("Usuário cadastrado"); }} />
    </div>
  );
}

function NovoUsuario({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; onSave: (u: Usuario) => void }) {
  const [form, setForm] = useState({ nome: "", email: "", perfil: "tecnico" as Perfil });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.nome || !form.email) { toast.error("Preencha nome e e-mail"); return; } onSave({ id: "u" + Date.now(), ativo: true, criadoEm: new Date().toISOString(), ...form }); onOpenChange(false); }} className="space-y-3">
          <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
          <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Perfil</Label>
            <Select value={form.perfil} onValueChange={(v: Perfil) => setForm({ ...form, perfil: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(perfilLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
