import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { osExternasMock, clientesMock, equipamentosBkpMock, configComissaoMock } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Eraser, CheckCircle2, MapPin, Phone, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/finalizar/$osId")({
  head: () => ({ meta: [{ title: "Finalizar OS — TechSuporte" }] }),
  component: FinalizarPage,
});

function FinalizarPage() {
  const { osId } = Route.useParams();
  const navigate = useNavigate();
  const sigRef = useRef<SignatureCanvas | null>(null);
  const os = osExternasMock.find(o => o.id === osId);
  const cli = clientesMock.find(c => c.id === os?.clienteId);

  const [form, setForm] = useState({
    servicoRealizado: "", problemasEncontrados: "", solucaoAplicada: "",
    equipamentoRetirado: false, pcBkpDeixado: false, pcBkpRecolhido: false, pcBkpId: "none",
    vendaCashBkp: 0, vendaVpn: 0, vendaHardwareDescricao: "", vendaHardwareValor: 0,
    nomeAssinante: "", documentoCargo: "", fotos: [] as string[],
  });

  if (!os) {
    return (
      <div className="text-center py-12">
        <p>OS não encontrada</p>
        <Button onClick={() => navigate({ to: "/mural" })} className="mt-4">Voltar ao mural</Button>
      </div>
    );
  }

  const finalizar = () => {
    if (!form.servicoRealizado) { toast.error("Descreva o serviço realizado"); return; }
    if (!form.nomeAssinante) { toast.error("Informe o nome de quem assinou"); return; }
    if (sigRef.current?.isEmpty()) { toast.error("Assinatura do cliente é obrigatória"); return; }

    const comissaoBase = configComissaoMock.osExterna;
    const comissaoExtras = form.vendaCashBkp + form.vendaVpn;
    toast.success(`OS finalizada! Comissão: R$ ${(comissaoBase + comissaoExtras).toFixed(2)} (após validação)`);
    setTimeout(() => navigate({ to: "/mural" }), 800);
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = () => setForm(s => ({ ...s, fotos: [...s.fotos, r.result as string] }));
      r.readAsDataURL(f);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title={`Finalizar ${os.codigo}`} description={cli?.nomeEmpresa} />

      <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{cli?.nomeEmpresa}</h3>
          <StatusBadge status={os.status} />
        </div>
        <p className="text-sm text-muted-foreground">{os.descricao}</p>
        <div className="text-sm flex flex-col gap-1">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {os.endereco}</span>
          <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {os.telefone}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold">Execução</h3>
        <div><Label>Serviço realizado *</Label><Textarea rows={3} value={form.servicoRealizado} onChange={(e) => setForm({ ...form, servicoRealizado: e.target.value })} /></div>
        <div><Label>Problemas encontrados</Label><Textarea rows={2} value={form.problemasEncontrados} onChange={(e) => setForm({ ...form, problemasEncontrados: e.target.value })} /></div>
        <div><Label>Solução aplicada</Label><Textarea rows={2} value={form.solucaoAplicada} onChange={(e) => setForm({ ...form, solucaoAplicada: e.target.value })} /></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Toggle label="Equipamento retirado?" value={form.equipamentoRetirado} onChange={(v) => setForm({ ...form, equipamentoRetirado: v })} />
          <Toggle label="PC BKP deixado?" value={form.pcBkpDeixado} onChange={(v) => setForm({ ...form, pcBkpDeixado: v })} />
          <Toggle label="PC BKP recolhido?" value={form.pcBkpRecolhido} onChange={(v) => setForm({ ...form, pcBkpRecolhido: v })} />
        </div>

        {(form.pcBkpDeixado || form.pcBkpRecolhido) && (
          <div>
            <Label>Equipamento BKP</Label>
            <Select value={form.pcBkpId} onValueChange={(v) => setForm({ ...form, pcBkpId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione o BKP" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {equipamentosBkpMock.map(b => <SelectItem key={b.id} value={b.id}>{b.codigo} — {b.marcaModelo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-4 mt-4">
        <h3 className="font-semibold">Vendas adicionais</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>CashBKP</Label>
            <Select value={String(form.vendaCashBkp)} onValueChange={(v) => setForm({ ...form, vendaCashBkp: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não vendeu</SelectItem>
                <SelectItem value="20">R$ 20,00</SelectItem>
                <SelectItem value="30">R$ 30,00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>VPN</Label>
            <Select value={String(form.vendaVpn)} onValueChange={(v) => setForm({ ...form, vendaVpn: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não vendeu</SelectItem>
                <SelectItem value="30">R$ 30,00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Hardware — descrição</Label><Input value={form.vendaHardwareDescricao} onChange={(e) => setForm({ ...form, vendaHardwareDescricao: e.target.value })} placeholder="Ex: Cabo de rede 5m" /></div>
          <div><Label>Hardware — valor (R$)</Label><Input type="number" min={0} step="0.01" value={form.vendaHardwareValor} onChange={(e) => setForm({ ...form, vendaHardwareValor: Number(e.target.value) })} /></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-3 mt-4">
        <h3 className="font-semibold">Fotos / anexos</h3>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/30">
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Adicionar fotos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={onPhoto} />
        </label>
        {form.fotos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {form.fotos.map((f, i) => (
              <div key={i} className="relative">
                <img src={f} className="w-full h-20 object-cover rounded border border-border" />
                <button onClick={() => setForm(s => ({ ...s, fotos: s.fotos.filter((_, ix) => ix !== i) }))} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground grid place-items-center">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-3 mt-4">
        <h3 className="font-semibold">Assinatura do cliente *</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Nome de quem assinou *</Label><Input value={form.nomeAssinante} onChange={(e) => setForm({ ...form, nomeAssinante: e.target.value })} /></div>
          <div><Label>Documento / cargo</Label><Input value={form.documentoCargo} onChange={(e) => setForm({ ...form, documentoCargo: e.target.value })} /></div>
        </div>
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <SignatureCanvas
            ref={(r) => { sigRef.current = r; }}
            penColor="black"
            canvasProps={{ className: "w-full h-40" }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => sigRef.current?.clear()} className="gap-2">
          <Eraser className="h-4 w-4" /> Limpar assinatura
        </Button>
      </div>

      <div className="sticky bottom-4 mt-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate({ to: "/mural" })} className="flex-1">Cancelar</Button>
        <Button onClick={finalizar} className="flex-[2]"><CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar atendimento</Button>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/30">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </label>
  );
}
