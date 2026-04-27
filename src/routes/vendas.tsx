import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatCard } from "@/components/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vendasMock, clientesMock, usuariosMock } from "@/lib/mockData";
import { formatBRL, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { Coins, DollarSign, Package } from "lucide-react";

export const Route = createFileRoute("/vendas")({
  head: () => ({ meta: [{ title: "Vendas — TechSuporte" }] }),
  component: VendasPage,
});

function VendasPage() {
  const [tipo, setTipo] = useState("all");

  const filtradas = useMemo(() => vendasMock.filter(v => tipo === "all" || v.tipo === tipo), [tipo]);
  const total = filtradas.reduce((s, v) => s + (v.status !== "Cancelada" ? v.valor : 0), 0);
  const cashbkp = vendasMock.filter(v => v.tipo === "CashBKP" && v.status !== "Cancelada").reduce((s, v) => s + v.valor, 0);
  const vpn = vendasMock.filter(v => v.tipo === "VPN" && v.status !== "Cancelada").reduce((s, v) => s + v.valor, 0);
  const hardware = vendasMock.filter(v => v.tipo === "Hardware" && v.status !== "Cancelada").reduce((s, v) => s + v.valor, 0);

  const cli = (id: string) => clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—";
  const tec = (id: string) => usuariosMock.find(u => u.id === id)?.nome ?? "—";

  return (
    <div>
      <PageHeader title="Vendas adicionais" description="Vendas realizadas durante atendimentos." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="CashBKP" value={formatBRL(cashbkp)} icon={Coins} tone="success" />
        <StatCard title="VPN" value={formatBRL(vpn)} icon={DollarSign} tone="success" />
        <StatCard title="Hardware" value={formatBRL(hardware)} icon={Package} tone="success" />
        <StatCard title="Total filtrado" value={formatBRL(total)} icon={DollarSign} tone="info" />
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="p-4 border-b border-border">
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="CashBKP">CashBKP</SelectItem>
              <SelectItem value="VPN">VPN</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Técnico</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Descrição</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Valor</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(v => (
                <tr key={v.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(v.data)}</td>
                  <td className="px-4 py-3">{cli(v.clienteId)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{tec(v.tecnicoId)}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.tipo} tone="primary" /></td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{v.descricao}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatBRL(v.valor)}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
