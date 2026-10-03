import { createFileRoute } from "@tanstack/react-router";
import { Brain, History, Info } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/edge/AppShell";
import { HISTORICAL_PATTERN, MEMORY_TIMELINE } from "@/lib/edgepulse";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Device AI Memory — EdgePulse AI" },
      {
        name: "description",
        content:
          "Persistent device memory: past incidents, resolutions and historical pattern matching for Motor #27.",
      },
      { property: "og:title", content: "Device AI Memory — EdgePulse AI" },
      {
        property: "og:description",
        content: "EdgePulse remembers significant machine events and uses them as context.",
      },
    ],
  }),
  component: AiMemory,
});

function AiMemory() {
  return (
    <>
      <PageHeader
        title="Device AI Memory"
        subtitle="EdgePulse remembers significant machine events and uses historical context to understand new behavior."
        right={
          <div className="text-right">
            <div className="label-xs">Motor #27</div>
            <div className="text-sm font-semibold text-healthy">Memory status: ACTIVE</div>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <section className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <History className="size-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-[0.12em]">CONTEXTUAL MEMORY TIMELINE</h2>
          </div>
          <ol className="relative border-l border-border pl-5">
            {MEMORY_TIMELINE.map((m) => (
              <li key={m.date} className="relative pb-6 last:pb-0">
                <span
                  className={`absolute -left-[26px] top-1 size-2.5 rounded-full border-2 border-background ${
                    m.today ? "pulse-dot bg-critical" : "bg-primary"
                  }`}
                />
                <div
                  className={`border p-3 ${
                    m.today
                      ? "border-critical/40 bg-critical/8"
                      : "border-border bg-surface-raised"
                  }`}
                >
                  <div
                    className={`numeric text-[11px] tracking-[0.14em] ${m.today ? "text-critical" : "text-primary"}`}
                  >
                    {m.date}
                  </div>
                  <div className="mt-1 text-sm font-medium">{m.event}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Resolution: {m.resolution}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-4">
          <section className="panel p-5">
            <h2 className="text-sm font-semibold tracking-[0.12em]">
              CURRENT PATTERN VS HISTORICAL PATTERN
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="border border-accent/40 bg-accent/10 p-3">
                <div className="label-xs">Historical similarity</div>
                <div className="numeric mt-1 text-2xl font-semibold text-accent">82%</div>
              </div>
              <div className="border border-critical/40 bg-critical/10 p-3">
                <div className="label-xs">Risk</div>
                <div className="mt-1 text-2xl font-semibold text-critical">HIGH</div>
              </div>
              <div className="border border-border bg-surface-raised p-3">
                <div className="label-xs">Historical event</div>
                <div className="mt-1 text-sm font-medium">Bearing anomaly — Aug 14</div>
              </div>
            </div>

            <div className="mt-5 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_PATTERN} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="step"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    name="Aug 14 anomaly (mm/s)"
                    stroke="var(--chart-2)"
                    strokeDasharray="5 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    name="Current pattern (mm/s)"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel edge-glow p-5">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-[0.12em]">AI EXPLANATION</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              The current combination of rising temperature and vibration resembles the behavioral
              pattern recorded before the Aug 14 bearing anomaly.
            </p>
          </section>

          <section className="panel border-primary/30 p-4">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-primary" />
              <h3 className="text-xs font-semibold tracking-[0.14em]">WHY THIS MATTERS</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Instead of treating this as an isolated alert, EdgePulse uses the machine's historical
              memory to provide contextual intelligence.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
