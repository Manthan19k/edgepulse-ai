import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Brain, TrendingUp } from "lucide-react";
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
import { BASELINE, statusBg, useEdgePulse } from "@/lib/edgepulse";

export const Route = createFileRoute("/device")({
  head: () => ({
    meta: [
      { title: "Device Intelligence — EdgePulse AI" },
      {
        name: "description",
        content:
          "Real-time behavioral intelligence, sensor drift and AI health scoring for monitored industrial assets.",
      },
      { property: "og:title", content: "Device Intelligence — EdgePulse AI" },
      {
        property: "og:description",
        content: "Real-time behavioral intelligence for monitored industrial assets.",
      },
    ],
  }),
  component: DeviceIntelligence,
});

function pct(current: number, base: number) {
  const change = ((current - base) / base) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}% from baseline`;
}

function SensorCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "critical" | "warning" | "muted";
}) {
  const toneClass =
    tone === "critical"
      ? "text-critical"
      : tone === "warning"
        ? "text-warning"
        : "text-muted-foreground";
  return (
    <div className="panel p-4">
      <div className="label-xs">{label}</div>
      <div className="numeric mt-2 text-2xl font-semibold">{value}</div>
      <div className={`numeric mt-1 text-[11px] ${toneClass}`}>{delta}</div>
    </div>
  );
}

function DriftRow({
  metric,
  baseline,
  current,
  unit,
}: {
  metric: string;
  baseline: number;
  current: number;
  unit: string;
}) {
  const change = ((current - baseline) / baseline) * 100;
  const severe = change > 25;
  return (
    <div className="grid grid-cols-4 items-center gap-2 border-b border-border py-3 text-sm last:border-0">
      <span className="font-medium">{metric}</span>
      <span className="numeric text-muted-foreground">
        {baseline} {unit}
      </span>
      <span className="numeric">
        {current} {unit}
      </span>
      <span className={`numeric text-right ${severe ? "text-critical" : "text-warning"}`}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </div>
  );
}

function DeviceIntelligence() {
  const { selected, series, anomaly } = useEdgePulse();
  const isMotor27 = selected.id === "motor-27";

  return (
    <>
      <PageHeader
        title={selected.name}
        subtitle="Real-time behavioral intelligence"
        right={
          <div className="flex items-center gap-3">
            <span
              className={`border px-2.5 py-1 text-xs font-semibold tracking-[0.12em] ${statusBg(selected.status)}`}
            >
              {selected.status}
            </span>
            <div className="text-right">
              <div className="label-xs">AI Health Score</div>
              <div className="numeric text-xl font-semibold">{selected.health} / 100</div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <SensorCard
          label="Temperature"
          value={`${selected.temperature}°C`}
          delta={pct(selected.temperature, BASELINE.temperature)}
          tone={selected.temperature > 74 ? "critical" : "warning"}
        />
        <SensorCard
          label="Vibration"
          value={`${selected.vibration.toFixed(1)} mm/s`}
          delta={pct(selected.vibration, BASELINE.vibration)}
          tone={selected.vibration > 3 ? "critical" : "warning"}
        />
        <SensorCard
          label="Load"
          value={`${selected.load}%`}
          delta={pct(selected.load, BASELINE.load)}
          tone="muted"
        />
        <SensorCard
          label="RPM"
          value={String(selected.rpm)}
          delta="Normal"
          tone="muted"
        />
        <SensorCard
          label="Power"
          value={`${selected.power} kW`}
          delta={pct(selected.power, BASELINE.power)}
          tone="warning"
        />
      </div>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-[0.12em]">SENSOR TIME SERIES</h2>
            <p className="text-xs text-muted-foreground">
              Temperature and vibration trend over the last 24 hours
            </p>
          </div>
          <TrendingUp className="size-4 text-primary" />
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
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
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vibration"
                name="Vibration (mm/s)"
                stroke="var(--chart-5)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel p-5">
          <h2 className="text-sm font-semibold tracking-[0.12em]">BEHAVIORAL DRIFT</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {selected.name} is gradually deviating from its learned operating baseline.
          </p>
          <div className="mt-4">
            <div className="label-xs grid grid-cols-4 gap-2 pb-2">
              <span>Metric</span>
              <span>Baseline</span>
              <span>Current</span>
              <span className="text-right">Change</span>
            </div>
            <DriftRow
              metric="Temperature"
              baseline={BASELINE.temperature}
              current={selected.temperature}
              unit="°C"
            />
            <DriftRow
              metric="Vibration"
              baseline={BASELINE.vibration}
              current={selected.vibration}
              unit="mm/s"
            />
            <DriftRow
              metric="Power"
              baseline={BASELINE.power}
              current={selected.power}
              unit="kW"
            />
          </div>
        </section>

        <section className="panel border-critical/40 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-critical" />
            <h2 className="text-sm font-semibold tracking-[0.12em] text-critical">
              POTENTIAL BEARING FAILURE
            </h2>
          </div>
          <div className="mt-4 flex items-end gap-6">
            <div>
              <div className="label-xs">Confidence</div>
              <div className="numeric text-4xl font-semibold text-critical">86%</div>
            </div>
            <div className="flex-1">
              <div className="h-2 w-full bg-muted">
                <div className="h-full bg-critical" style={{ width: "86%" }} />
              </div>
              <div className="numeric mt-2 text-[11px] text-muted-foreground">
                Historical pattern match: 82% · Risk: HIGH
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            The combination of rising temperature and vibration indicates abnormal mechanical
            behavior.
          </p>
          <Link
            to="/memory"
            className="mt-5 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Brain className="size-4" /> View AI Memory <ArrowRight className="size-4" />
          </Link>
          {isMotor27 && !anomaly && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Run "Simulate Anomaly" on the Overview page to replay this detection live.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
