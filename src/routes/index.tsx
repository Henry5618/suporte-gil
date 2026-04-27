import { createFileRoute } from "@tanstack/react-router";
import { StatCard, PageHeader } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";
import {
  Phone, MapPin, Clock, CheckCircle2, Wrench, HardDrive, DollarSign, ShieldCheck, Coins, Timer
} from "lucide-react";
import { osInternasMock, osExternasMock, osOficinaMock, equipamentosBkpMock, vendasMock, usuariosMock, configComissaoMock } from "@/lib/mockData";
import { formatBRL, formatDuration } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — TechSuporte" }] }),
  component: Dashboard,
});

function Dashboard() {
  const today = new Date().toDateString();
  const isToday = (iso?: string) => iso && new Date(iso).toDateString() === today;

  const intHoje = osInternasMock.filter(o => isToday(o.fim) && o.status === "Finalizada").length;
  const extAbertas = osExternasMock.filter(o => ["Aberta", "Agendada", "Atribuída"].includes(o.status)).length;
  const extAtend = osExternasMock.filter(o => o.status === "Em atendimento").length;
  const extValid = osExternasMock.filter(o => o.status === "Finalizada pelo técnico").length;
  const oficina = osOficinaMock.filter(o => !["Finalizado", "Cancelado"].includes(o.status)).length;
  const bkpEmp = equipamentosBkpMock.filter(b => b.status === "Emprestado").length;

  const mesAtual = new Date().getMonth();
  const vendasMes = vendasMock.filter(v => new Date(v.data).getMonth() === mesAtual && v.status !== "Cancelada");
  const cashbkp = vendasMes.filter(v => v.tipo === "CashBKP").reduce((s, v) => s + v.valor, 0);
  const vpn = vendasMes.filter(v => v.tipo === "VPN").reduce((s, v) => s + v.valor, 0);
  const hardware = vendasMes.filter(v => v.tipo === "Hardware").reduce((s, v) => s + v.valor, 0);

  const tempoHoje = osInternasMock.filter(o => isToday(o.fim)).reduce((s, o) => s + o.tempoMinutos, 0);

  // Comissão
  const comissaoTotal =
    osInternasMock.filter(o => o.status === "Finalizada").length * configComissaoMock.osInterna +
    osExternasMock.filter(o => o.status === "Validada pelo gestor").length * configComissaoMock.osExterna +
    cashbkp + vpn;

  // Charts
  const porTecnico = usuariosMock.filter(u => u.perfil === "tecnico").map(t => ({
    nome: t.nome.split(" ")[0],
    interna: osInternasMock.filter(o => o.tecnicoId === t.id).length,
    externa: osExternasMock.filter(o => o.tecnicoDesignadoId === t.id).length,
  }));

  const porTipo = [
    { name: "Internas", value: osInternasMock.length, color: "var(--color-chart-1)" },
    { name: "Externas", value: osExternasMock.length, color: "var(--color-chart-2)" },
    { name: "Oficina", value: osOficinaMock.length, color: "var(--color-chart-3)" },
  ];

  const vendasPorMes = [
    { mes: "Jul", valor: 280 },
    { mes: "Ago", valor: 350 },
    { mes: "Set", valor: 420 },
    { mes: "Out", valor: 510 },
    { mes: "Nov", valor: 380 },
    { mes: "Dez", valor: cashbkp + vpn + hardware },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral da operação." />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        <StatCard title="OS internas hoje" value={intHoje} icon={Phone} tone="info" hint="Finalizadas hoje" />
        <StatCard title="Externas abertas" value={extAbertas} icon={MapPin} tone="default" />
        <StatCard title="Em atendimento" value={extAtend} icon={Clock} tone="warning" />
        <StatCard title="Aguardando validação" value={extValid} icon={ShieldCheck} tone="warning" />
        <StatCard title="Equipamentos na oficina" value={oficina} icon={Wrench} tone="info" />
        <StatCard title="PCs BKP emprestados" value={bkpEmp} icon={HardDrive} tone="warning" />
        <StatCard title="CashBKP no mês" value={formatBRL(cashbkp)} icon={Coins} tone="success" />
        <StatCard title="VPN no mês" value={formatBRL(vpn)} icon={DollarSign} tone="success" />
        <StatCard title="Hardware no mês" value={formatBRL(hardware)} icon={DollarSign} tone="success" />
        <StatCard title="Comissão parcial" value={formatBRL(comissaoTotal)} icon={CheckCircle2} tone="success" hint="Mês atual" />
        <StatCard title="Tempo total hoje" value={formatDuration(tempoHoje)} icon={Timer} tone="info" />
        <StatCard title="Tempo médio" value={formatDuration(Math.round(tempoHoje / Math.max(1, intHoje)))} icon={Timer} tone="default" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Atendimentos por técnico</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={porTecnico}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="interna" fill="var(--color-chart-1)" name="Internas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="externa" fill="var(--color-chart-2)" name="Externas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Atendimentos por tipo</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={porTipo} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {porTipo.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Vendas adicionais por mês (R$)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={vendasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="valor" stroke="var(--color-chart-1)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
