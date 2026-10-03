import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  ChevronDown,
  CircuitBoard,
  IndianRupee,
  Play,
  RotateCcw,
  Sparkles,
  Thermometer,
  Waves,
} from "lucide-react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/edge/AppShell";
import { EVENT_LOG, statusBg, useEdgePulse } from "@/lib/edgepulse";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Edge Intelligence Center — EdgePulse AI" },
      {
        name: "description",
        content:
          "Real-time machine intelligence powered by contextual AI memory across 24 edge-monitored assets.",
      },
      { property: "og:title", content: "Edge Intelligence Center — EdgePulse AI" },
      {
        property: "og:description",
        content: "Real-time machine intelligence powered by contextual AI memory.",
      },
    ],
  }),
  component: Overview,
});

const PIPELINE = ["SENSORS", "EDGE AI", "LOCAL MEMORY", "ANOMALY DETECTION", "PREDICTION", "ACTION"];

function Kpi({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "healthy" | "warning" | "critical" | "primary";
}) {
  const toneClass = {
    default: "text-foreground",
    healthy: "text-healthy",
    warning: "text-warning",
    critical: "text-critical",
    primary: "text-primary",
  }[tone];
  return (
    <div className="panel p-4">
      <div className="label-xs">{label}</div>
      <div className={`numeric mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

const chartTooltip = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontSize: "12px",
  },
  labelStyle: { color: "var(--muted-foreground)" },
};

function Overview() {
  const { anomaly, simulate, reset, devices, series, setSelectedId } = useEdgePulse();
  const navigate = useNavigate();


  const runSimulation = () => {
    simulate();
    toast.warning("AI detected behavioral drift in Motor #27", {
      description: "Potential Bearing Failure · Confidence 86% · Historical pattern match 82%",
      duration: 6000,
    });
  };

  const openMotor = () => {
    setSelectedId("motor-27");
    navigate({ to: "/device" });
  };

  return (
    <>
      <PageHeader
        title="Edge Intelligence Center"
        subtitle="Real-time machine intelligence powered by contextual AI memory."
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={runSimulation}
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Play className="size-4" /> SIMULATE ANOMALY
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-4" /> RESET SIMULATION
        </button>
        {anomaly && (
          <span className="numeric inline-flex items-center gap-2 border border-critical/40 bg-critical/10 px-3 py-2 text-xs text-critical">
            <AlertTriangle className="size-3.5" /> LIVE ANOMALY EVENT · MOTOR #27
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Active Devices" value="24" />
        <Kpi label="Healthy" value={anomaly ? "19" : "20"} tone="healthy" />
        <Kpi label="Warning" value={anomaly ? "3" : "4"} tone="warning" />
        <Kpi label="Critical" value={anomaly ? "2" : "1"} tone="critical" />
        <Kpi label="Predicted Issues" value={anomaly ? "2" : "1"} tone="primary" />
        <Kpi label="Est. Savings" value="₹18,400" tone="healthy" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="panel flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.12em]">SYSTEM HEALTH — LAST 24H</h2>
              <p className="text-xs text-muted-foreground">
                Average temperature, vibration and fleet health score
              </p>
            </div>
            <Activity className="size-4 text-primary" />
          </div>
          <div className="min-h-[300px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="t"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  yAxisId="left"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  domain={[40, 100]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  domain={[1.5, 3.6]}
                />
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  name="Avg temperature (°C)"
                  stroke="var(--chart-1)"
                  fill="url(#gTemp)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="health"
                  name="Health score"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="vibration"
                  name="Avg vibration (mm/s)"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-4">
          <section className="panel edge-glow p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-[0.12em]">AI INSIGHT</h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              Motor #27 is showing a gradual behavioral drift. Current vibration and temperature
              patterns closely resemble a previous bearing anomaly stored in its device memory.
            </p>
            <div className="mt-4 border-t border-border pt-3">
              <div className="label-xs">Recommended action</div>
              <p className="mt-1.5 text-sm text-foreground/90">
                Schedule a bearing inspection during the next maintenance cycle.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="numeric border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                82% historical similarity
              </span>
              <Link
                to="/memory"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Brain className="size-3.5" /> View AI Memory
              </Link>
            </div>
          </section>

          <section className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <CircuitBoard className="size-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-[0.12em]">EDGE PIPELINE</h2>
            </div>
            <ol className="space-y-1">
              {PIPELINE.map((step, i) => (
                <li key={step}>
                  <div className="numeric flex items-center gap-2 border border-border bg-surface-raised px-3 py-1.5 text-[11px] tracking-[0.1em]">
                    <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <ChevronDown className="mx-auto size-3 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-[0.12em]">MACHINE HEALTH OVERVIEW</h2>
          <div className="space-y-2">
            {devices.map((d) => {
              const clickable = d.id === "motor-27";
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedId(d.id);
                    navigate({ to: "/device" });
                  }}
                  className="flex w-full flex-wrap items-center justify-between gap-4 border border-border bg-surface-raised px-4 py-3 text-left transition-colors hover:border-primary/50"
                >
                  <div className="min-w-[140px]">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.type}</div>
                  </div>
                  <span
                    className={`border px-2 py-0.5 text-[11px] font-semibold tracking-[0.1em] ${statusBg(d.status)}`}
                  >
                    {d.status}
                  </span>
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-1.5 w-full max-w-40 bg-muted">
                      <div
                        className={`h-full ${d.status === "CRITICAL" ? "bg-critical" : d.status === "WARNING" ? "bg-warning" : "bg-healthy"}`}
                        style={{ width: `${d.health}%` }}
                      />
                    </div>
                    <span className="numeric text-sm">{d.health}%</span>
                  </div>
                  <span className="numeric flex items-center gap-1 text-sm text-muted-foreground">
                    <Thermometer className="size-3.5" />
                    {d.temperature}°C
                  </span>
                  <span className="numeric flex items-center gap-1 text-sm text-muted-foreground">
                    <Waves className="size-3.5" />
                    {d.vibration.toFixed(1)} mm/s
                  </span>
                  {clickable && <ArrowRight className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-[0.12em]">
            RECENT INTELLIGENCE EVENTS
          </h2>
          <ul className="space-y-3">
            {EVENT_LOG.map((e) => (
              <li key={e.time} className="flex gap-3 border-b border-border pb-3 last:border-0">
                <span
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                    e.level === "critical"
                      ? "bg-critical"
                      : e.level === "warning"
                        ? "bg-warning"
                        : e.level === "healthy"
                          ? "bg-healthy"
                          : "bg-primary"
                  }`}
                />
                <div>
                  <div className="text-sm">{e.event}</div>
                  <div className="numeric text-[11px] text-muted-foreground">
                    {e.time} · {e.device}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <IndianRupee className="size-3.5 text-healthy" />
            Estimated downtime avoided this month: ₹18,400
          </div>
          <button
            onClick={openMotor}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
          >
            INSPECT MOTOR #27 <ArrowRight className="size-3.5" />
          </button>
        </section>
      </div>
    </>
  );
}
