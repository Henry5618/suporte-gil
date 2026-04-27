import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "info" | "destructive" | "muted" | "primary";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-info/10 text-info border-info/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
};

export function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  const t: Tone = tone ?? statusTone(status);
  return (
    <span className={cn("status-badge", toneClasses[t])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", `bg-current`)} />
      {status}
    </span>
  );
}

export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (s.includes("finaliz") && s.includes("técnico")) return "info";
  if (s.includes("validada") || s.includes("reparado") || s.includes("disponí")) return "success";
  if (s.includes("finaliz")) return "success";
  if (s.includes("cancel")) return "destructive";
  if (s.includes("urgente") || s.includes("alta")) return "destructive";
  if (s.includes("aguardando")) return "warning";
  if (s.includes("em atendimento") || s.includes("em análise") || s.includes("em manuten")) return "info";
  if (s.includes("emprestado")) return "warning";
  if (s.includes("aberta") || s.includes("agendada") || s.includes("atribuída") || s.includes("entrada")) return "primary";
  return "muted";
}
