import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { configComissaoMock } from "@/lib/mockData";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — TechSuporte" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const [config, setConfig] = useState({ ...configComissaoMock });
  const [cats, setCats] = useState({
    prioridades: "Baixa, Normal, Alta, Urgente",
    statusOS: "Aberta, Agendada, Em atendimento, Finalizada",
    tiposEquipamento: "PC Desktop, Notebook, Impressora, Servidor, Roteador",
    tiposVenda: "CashBKP, VPN, Hardware, Outro",
  });

  const salvar = () => toast.success("Configurações salvas");

  return (
    <div>
      <PageHeader title="Configurações" description="Valores de comissão, categorias e parâmetros do sistema." />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Comissões">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="OS interna / remota (R$ por OS)" value={config.osInterna} onChange={(v) => setConfig({ ...config, osInterna: v })} />
            <Field label="OS externa validada (R$ por OS)" value={config.osExterna} onChange={(v) => setConfig({ ...config, osExterna: v })} />
            <Field label="VPN — valor padrão (R$)" value={config.vpnPadrao} onChange={(v) => setConfig({ ...config, vpnPadrao: v })} />
            <div>
              <Label>CashBKP — opções (R$)</Label>
              <Input value={config.cashBkpOpcoes.join(", ")} onChange={(e) => setConfig({ ...config, cashBkpOpcoes: e.target.value.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n)) })} />
            </div>
          </div>
        </Card>

        <Card title="Categorias">
          {Object.entries(cats).map(([k, v]) => (
            <div key={k} className="mb-3">
              <Label>{labels[k]}</Label>
              <Input value={v} onChange={(e) => setCats({ ...cats, [k]: e.target.value })} />
              <p className="text-xs text-muted-foreground mt-1">Separe por vírgula</p>
            </div>
          ))}
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={salvar}><Save className="h-4 w-4 mr-2" /> Salvar configurações</Button>
      </div>
    </div>
  );
}

const labels: Record<string, string> = {
  prioridades: "Prioridades",
  statusOS: "Status de OS",
  tiposEquipamento: "Tipos de equipamento",
  tiposVenda: "Tipos de venda",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" min={0} step="0.01" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
