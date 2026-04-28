import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wrench } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@empresa.com");
  const [senha, setSenha] = useState("123456");

  const [loading, setLoading] = useState(false);

  const doLogin = async (em: string, sn: string) => {
    setLoading(true);
    try {
      const ok = await login(em, sn);
      if (!ok) toast.error("E-mail ou senha inválidos");
      else toast.success("Bem-vindo!");
    } catch {
      toast.error("Falha ao conectar com o backend. Verifique se a API está rodando em VITE_API_URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    void doLogin(email, senha);
  };

  const quickLogin = (em: string) => {
    setEmail(em);
    setSenha("123456");
    void doLogin(em, "123456");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex bg-sidebar text-sidebar-foreground p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary grid place-items-center text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="font-bold text-lg">TechSuporte</div>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Gestão completa de Ordens de Serviço.</h2>
          <p className="mt-3 text-sidebar-foreground/70 max-w-md">
            Atendimentos internos, externos e de oficina em um só lugar. Controle de comissões, equipamentos BKP e validação por gestor.
          </p>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© {new Date().getFullYear()} TechSuporte</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-primary-foreground">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="font-bold text-lg">TechSuporte</div>
          </div>
          <h1 className="text-2xl font-bold">Entrar no sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse com seu e-mail corporativo.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Acesso rápido (demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => quickLogin("admin@empresa.com")}>Administrador</Button>
              <Button size="sm" variant="outline" onClick={() => quickLogin("gestor@empresa.com")}>Gestor</Button>
              <Button size="sm" variant="outline" onClick={() => quickLogin("tecnico@empresa.com")}>Técnico</Button>
              <Button size="sm" variant="outline" onClick={() => quickLogin("oficina@empresa.com")}>Oficina</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
