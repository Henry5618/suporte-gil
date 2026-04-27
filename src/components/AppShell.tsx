import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Phone, MapPin, ClipboardList, Wrench,
  HardDrive, ShoppingCart, BarChart3, UserCog, Settings, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/os-interna", label: "OS Interna / Remota", icon: Phone },
  { to: "/os-externa", label: "OS Externa", icon: MapPin },
  { to: "/mural", label: "Mural do Técnico", icon: ClipboardList },
  { to: "/oficina", label: "Oficina / Equipamentos", icon: Wrench },
  { to: "/bkp", label: "Equipamentos BKP", icon: HardDrive },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/usuarios", label: "Usuários", icon: UserCog },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const perfilLabel: Record<string, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  tecnico: "Técnico",
  oficina: "Oficina",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <>
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold">
            TS
          </div>
          <div>
            <div className="font-semibold text-sidebar-foreground leading-tight">TechSuporte</div>
            <div className="text-[11px] text-sidebar-foreground/60 leading-tight">Gestão de OS</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="px-2 py-2 mb-2 rounded-md bg-sidebar-accent/40">
          <div className="text-sm font-medium text-sidebar-foreground truncate">{user?.nome}</div>
          <div className="text-[11px] text-sidebar-foreground/60">{user ? perfilLabel[user.perfil] : ""}</div>
        </div>
        <Button onClick={logout} variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground flex-col fixed inset-y-0 left-0 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-card border-b border-border h-14 flex items-center px-4 gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Sistema online
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
