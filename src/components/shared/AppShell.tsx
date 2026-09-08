import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Scale,
  Printer,
  ShieldCheck,
  RotateCcw,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export type Role = "enrolment" | "adjudicator" | "perso" | "qa" | "admin";
export type Module = "dashboard" | "enrolment" | "adjudication" | "perso" | "qa" | "reperso";

const roleConfig: Record<Role, { label: string; color: string; modules: Module[] }> = {
  enrolment:   { label: "Enrolment Officer", color: "#0068B7", modules: ["dashboard", "enrolment"] },
  adjudicator: { label: "Adjudicator",       color: "#0068B7", modules: ["dashboard", "adjudication"] },
  perso:       { label: "Perso Operator",    color: "#0082D6", modules: ["dashboard", "perso"] },
  qa:          { label: "QA Officer",        color: "#16a34a", modules: ["dashboard", "qa", "reperso"] },
  admin:       { label: "System Admin",      color: "#d97706", modules: ["dashboard", "enrolment", "adjudication", "perso", "qa", "reperso"] },
};

const navItems: { id: Module; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "enrolment",   label: "Enrolment",    icon: FileText },
  { id: "adjudication",label: "Adjudication", icon: Scale },
  { id: "perso",       label: "Perso",        icon: Printer },
  { id: "qa",          label: "QA",           icon: ShieldCheck },
  { id: "reperso",     label: "Re-Perso",     icon: RotateCcw },
];

interface AppShellProps {
  role: Role;
  currentModule: Module;
  onModuleChange: (m: Module) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AppShell({ role, currentModule, onModuleChange, onLogout, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const config = roleConfig[role];
  const allowedModules = config.modules;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#F3F7FB" }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden"
        style={{
          width: sidebarOpen ? "224px" : "60px",
          background: "#FFFFFF",
          borderRight: "1px solid #D6E2EE",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
          style={{ borderColor: "#D6E2EE", minHeight: "64px" }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: "34px", height: "34px", background: "#0068B7" }}
          >
            <span style={{ color: "white", fontWeight: 800, fontSize: "15px" }}>T</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="toppan-wordmark" style={{ fontSize: "15px" }}>TOPP<span>AN</span></div>
              <div style={{ color: "#7A9AB8", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Security · IDS
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const allowed = allowedModules.includes(item.id);
            const active  = currentModule === item.id;
            const Icon    = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => allowed && onModuleChange(item.id)}
                disabled={!allowed}
                title={!sidebarOpen ? item.label : undefined}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100"
                style={{
                  color: active ? "#0068B7" : allowed ? "#4A6080" : "#B3CAE0",
                  cursor: allowed ? "pointer" : "not-allowed",
                  background: active ? "#EAF1F8" : "transparent",
                  borderLeftWidth: "2px",
                  borderLeftStyle: "solid",
                  borderLeftColor: active ? "#0068B7" : "transparent",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (allowed && !active) (e.currentTarget as HTMLElement).style.background = "#F3F7FB"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Icon size={15} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Tagline */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "#D6E2EE" }}>
            <p style={{ color: "#B3CAE0", fontSize: "9px", letterSpacing: "0.06em", lineHeight: 1.6 }}>
              Trust at Every Touchpoint.<br />Across Identity &amp; Payment.
            </p>
          </div>
        )}

        {/* Collapse */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center p-3 border-t transition-colors"
          style={{ borderColor: "#D6E2EE", color: "#7A9AB8" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#3D5872")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#7A9AB8")}
        >
          {sidebarOpen ? <X size={13} /> : <Menu size={13} />}
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{
            height: "64px",
            borderBottom: "1px solid #D6E2EE",
            background: "#FFFFFF",
          }}
        >
          <div>
            <h1 className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>
              {navItems.find((n) => n.id === currentModule)?.label || "Dashboard"}
            </h1>
            <p className="text-xs" style={{ color: "#7A9AB8" }}>
              TOPPAN Security · Identity Document System
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* AI badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full ai-badge"
              style={{ fontSize: "11px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full ai-pulse" style={{ background: "#0082D6" }} />
              <span style={{ color: "#0068B7" }}>AI Active</span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "#7A9AB8" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F3F7FB")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "#dc2626" }} />
            </button>

            {/* User chip */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "#F3F7FB", border: "1px solid #D6E2EE" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#0068B7", color: "white" }}
              >
                {config.label[0]}
              </div>
              {sidebarOpen && (
                <>
                  <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
                  <ChevronDown size={11} style={{ color: "#7A9AB8" }} />
                </>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#7A9AB8" }}
              title="Sign out"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FEF2F2"; (e.currentTarget as HTMLElement).style.color = "#dc2626"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#7A9AB8"; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "#F3F7FB" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
