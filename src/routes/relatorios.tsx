import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";
import { osInternasMock, osExternasMock, osOficinaMock, vendasMock, equipamentosBkpMock, usuariosMock, clientesMock, configComissaoMock } from "@/lib/mockData";
import { formatBRL, formatDate, formatDuration } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — TechSuporte" }] }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const [tab, setTab] = useState("tecnicos");

  const tecnicos = usuariosMock.filter(u => u.perfil === "tecnico");
  const cli = (id: string) => clientesMock.find(c => c.id === id)?.nomeEmpresa ?? "—";

  const exportar = (fmt: "xlsx" | "pdf") => toast.success(`Exportação ${fmt.toUpperCase()} simulada — integração futura`);

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Análises consolidadas de produtividade, comissão e operação."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportar("xlsx")}><Download className="h-4 w-4 mr-2" /> Excel</Button>
            <Button variant="outline" onClick={() => exportar("pdf")}><FileText className="h-4 w-4 mr-2" /> PDF</Button>
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="tecnicos">Por técnico</TabsTrigger>
          <TabsTrigger value="comissao">Comissão</TabsTrigger>
          <TabsTrigger value="tempo">Tempo</TabsTrigger>
          <TabsTrigger value="oficina">Oficina</TabsTrigger>
          <TabsTrigger value="bkp">PC BKP</TabsTrigger>
        </TabsList>

        <TabsContent value="tecnicos">
          <div className="bg-card border border-border rounded-xl mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Técnico</th>
                  <th className="px-4 py-3 font-medium text-right">Internas</th>
                  <th className="px-4 py-3 font-medium text-right">Externas</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-right">Tempo total</th>
                  <th className="px-4 py-3 font-medium text-right">Comissão</th>
                </tr>
              </thead>
              <tbody>
                {tecnicos.map(t => {
                  const ints = osInternasMock.filter(o => o.tecnicoId === t.id && o.status === "Finalizada");
                  const exts = osExternasMock.filter(o => o.tecnicoDesignadoId === t.id && o.status === "Validada pelo gestor");
                  const tempo = ints.reduce((s, o) => s + o.tempoMinutos, 0);
                  const vendas = vendasMock.filter(v => v.tecnicoId === t.id && v.status !== "Cancelada").reduce((s, v) => s + v.valor, 0);
                  const com = ints.length * configComissaoMock.osInterna + exts.length * configComissaoMock.osExterna + vendas;
                  return (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{t.nome}</td>
                      <td className="px-4 py-3 text-right">{ints.length}</td>
                      <td className="px-4 py-3 text-right">{exts.length}</td>
                      <td className="px-4 py-3 text-right font-semibold">{ints.length + exts.length}</td>
                      <td className="px-4 py-3 text-right">{formatDuration(tempo)}</td>
                      <td className="px-4 py-3 text-right text-success font-semibold">{formatBRL(com)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="comissao">
          <div className="bg-card border border-border rounded-xl mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Técnico</th>
                  <th className="px-4 py-3 font-medium text-right">Interna ({formatBRL(configComissaoMock.osInterna)}/un)</th>
                  <th className="px-4 py-3 font-medium text-right">Externa ({formatBRL(configComissaoMock.osExterna)}/un)</th>
                  <th className="px-4 py-3 font-medium text-right">Vendas</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {tecnicos.map(t => {
                  const ints = osInternasMock.filter(o => o.tecnicoId === t.id && o.status === "Finalizada").length;
                  const exts = osExternasMock.filter(o => o.tecnicoDesignadoId === t.id && o.status === "Validada pelo gestor").length;
                  const vendas = vendasMock.filter(v => v.tecnicoId === t.id && v.status !== "Cancelada").reduce((s, v) => s + v.valor, 0);
                  const cInt = ints * configComissaoMock.osInterna;
                  const cExt = exts * configComissaoMock.osExterna;
                  return (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{t.nome}</td>
                      <td className="px-4 py-3 text-right">{formatBRL(cInt)}</td>
                      <td className="px-4 py-3 text-right">{formatBRL(cExt)}</td>
                      <td className="px-4 py-3 text-right">{formatBRL(vendas)}</td>
                      <td className="px-4 py-3 text-right text-success font-bold">{formatBRL(cInt + cExt + vendas)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="tempo">
          <div className="bg-card border border-border rounded-xl mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Técnico</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium text-right">Tempo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {osInternasMock.map(o => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(o.criadoEm)}</td>
                    <td className="px-4 py-3">{usuariosMock.find(u => u.id === o.tecnicoId)?.nome}</td>
                    <td className="px-4 py-3">{cli(o.clienteId)}</td>
                    <td className="px-4 py-3">Interna ({o.tipoAtendimento})</td>
                    <td className="px-4 py-3 text-right">{formatDuration(o.tempoMinutos)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="oficina">
          <div className="bg-card border border-border rounded-xl mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Equipamento</th>
                  <th className="px-4 py-3 font-medium">Entrada</th>
                  <th className="px-4 py-3 font-medium">Diagnóstico</th>
                  <th className="px-4 py-3 font-medium text-right">Hardware</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {osOficinaMock.map(o => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3">{cli(o.clienteId)}</td>
                    <td className="px-4 py-3">{o.tipoEquipamento}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(o.dataEntrada)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.diagnostico ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{o.valorHardware ? formatBRL(o.valorHardware) : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="bkp">
          <div className="bg-card border border-border rounded-xl mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Cliente atual</th>
                  <th className="px-4 py-3 font-medium">Data saída</th>
                  <th className="px-4 py-3 font-medium">Retorno previsto</th>
                </tr>
              </thead>
              <tbody>
                {equipamentosBkpMock.map(b => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono">{b.codigo}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">{b.clienteAtualId ? cli(b.clienteAtualId) : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.dataSaida ? formatDate(b.dataSaida) : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.dataPrevistaRetorno ? formatDate(b.dataPrevistaRetorno) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
