import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { osExternasMock, clientesMock } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import { MapPin, Phone, Clock, Play, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { toast } from "sonner";
import type { OSExterna } from "@/lib/types";

export const Route = createFileRoute("/mural")({
  head: () => ({ meta: [{ title: "Mural do Técnico — TechSuporte" }] }),
  component: MuralPage,
});

function MuralPage() {
  const { user } = useAuth();
  const [lista, setLista] = useState<OSExterna[]>(osExternasMock);

  const minhas = lista.filter(o =>
    o.tecnicoDesignadoId === user?.id &&
    !["Validada pelo gestor", "Cancelada"].includes(o.status)
  );

  const iniciar = (id: string) => {
    setLista(lista.map(o => o.id === id ? { ...o, status: "Em atendimento", inicioAtendimento: new Date().toISOString() } : o));
    toast.success("Atendimento iniciado");
  };

  return (
    <div>
      <PageHeader title="Mural do Técnico" description={`Suas OS externas atribuídas — ${minhas.length} ativa(s).`} />

      {minhas.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Nenhuma OS externa atribuída a você</p>
          <p className="text-sm text-muted-foreground mt-1">Quando o gestor te atribuir uma OS, ela aparecerá aqui.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {minhas.map(o => {
            const cli = clientesMock.find(c => c.id === o.clienteId);
            const urgente = o.prioridade === "Urgente" || o.prioridade === "Alta";
            return (
              <div key={o.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className={`px-4 py-2 flex items-center justify-between text-xs font-medium ${urgente ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  <span className="font-mono">{o.codigo}</span>
                  {urgente && <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {o.prioridade}</span>}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{cli?.nomeEmpresa}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{o.descricao}</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" /> <span className="text-muted-foreground">{o.endereco}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <a href={`tel:${o.telefone}`} className="text-info">{o.telefone}</a></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {formatDate(o.dataPrevista)} — {o.horarioPrevisto}</div>
                  </div>
                  {o.equipamentosNecessarios && (
                    <div className="text-xs bg-muted/50 px-2 py-1.5 rounded">
                      <span className="font-medium">Levar:</span> {o.equipamentosNecessarios}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="flex gap-2 pt-1">
                    {o.status === "Atribuída" || o.status === "Agendada" ? (
                      <Button className="flex-1" onClick={() => iniciar(o.id)}>
                        <Play className="h-4 w-4 mr-2" /> Iniciar
                      </Button>
                    ) : (
                      <Button asChild className="flex-1">
                        <Link to="/finalizar/$osId" params={{ osId: o.id }}>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline">
                      <Link to="/finalizar/$osId" params={{ osId: o.id }}>Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
