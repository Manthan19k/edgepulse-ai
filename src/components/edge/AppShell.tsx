import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  Cpu,
  LayoutDashboard,
  MessageSquare,
  Radio,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEdgePulse } from "@/lib/edgepulse";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/device", label: "Device Intelligence", icon: Cpu },
  { to: "/memory", label: "AI Memory", icon: Brain },
  { to: "/predictions", label: "Predictions", icon: TrendingUp },
  { to: "/copilot", label: "AI Copilot", icon: MessageSquare },
] as const;

export function EdgeStatusDot({ label = "EDGE NODE ONLINE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-healthy/35 bg-healthy/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-healthy">
      <span className="pulse-dot inline-block size-1.5 rounded-full bg-healthy" />
      {label}
    </span>
  );
}

function DeviceSelector() {
  const { devices, selectedId, setSelectedId } = useEdgePulse();
  return (
    <label className="flex items-center gap-2">
      <span className="label-xs">Device</span>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="numeric border border-border bg-surface-raised px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
      >
        {devices.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <DeviceSelector />
        {right ?? <EdgeStatusDot />}
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="edge-glow flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex size-9 items-center justify-center border border-primary/40 bg-primary/10">
            <Radio className="size-4.5 text-primary" />
          </div>
          <div className="leading-none">
            <div className="text-sm font-bold tracking-[0.18em]">
              EDGE<span className="text-primary">PULSE AI</span>
            </div>
            <div className="mt-1.5 text-[10px] tracking-[0.16em] text-muted-foreground">
              EDGE INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border px-5 py-4">
          <EdgeStatusDot />
          <p className="numeric text-[11px] text-muted-foreground">Last sync: Just now</p>
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Activity className="size-3 text-primary" />
            Local intelligence active
          </p>
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Sensor analysis is performed locally before relevant insights are synchronized.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 md:hidden">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`whitespace-nowrap px-3 py-1.5 text-xs ${
                pathname === to ? "bg-primary/12 text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-[1400px] space-y-6 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
