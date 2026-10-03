import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
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
import { RISK_TREND } from "@/lib/edgepulse";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictive Intelligence — EdgePulse AI" },
      {
        name: "description",
        content:
          "Identify potential machine failures before they become downtime, with confidence scores and recommended actions.",
      },
      { property: "og:title", content: "Predictive Intelligence — EdgePulse AI" },
      {
        property: "og:description",
        content: "Identify potential failures before they become downtime.",
      },
    ],
  }),
  component: Predictions,
});

type Risk = "HIGH" | "MEDIUM" | "LOW";

const PREDICTIONS: {
  device: string;
  title: string;
  risk: Risk;
  confidence: number;
  eta: string;
  action: string;
}[] = [
  {
    device: "Motor #27",
    title: "Potential Bearing Failure",
    risk: "HIGH",
    confidence: 86,
    eta: "Next maintenance cycle",
    action:
      "Inspect bearing during the next maintenance cycle. Prioritize inspection if vibration continues increasing.",
  },
  {
    device: "Motor #18",
    title: "Overheating Risk",
    risk: "MEDIUM",
    confidence: 71,
    eta: "Within 2 maintenance cycles",
    action: "Check cooling airflow and ventilation.",
  },
  {
    device: "Pump #04",
    title: "No significant risk",
    risk: "LOW",
    confidence: 94,
    eta: "Not expected",
    action: "Continue normal monitoring.",
  },
];

const riskStyle: Record<Risk, string> = {
  HIGH: "border-critical/40 bg-critical/10 text-critical",
  MEDIUM: "border-warning/40 bg-warning/10 text-warning",
  LOW: "border-healthy/40 bg-healthy/10 text-healthy",
};

const riskIcon: Record<Risk, typeof ShieldAlert> = {
  HIGH: ShieldAlert,
  MEDIUM: ShieldQuestion,
  LOW: ShieldCheck,
};

function Predictions() {
  return (
    <>
      <PageHeader
        title="Predictive Intelligence"
        subtitle="Identify potential failures before they become downtime."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {PREDICTIONS.map((p) => {
          const Icon = riskIcon[p.risk];
          return (
            <section key={p.device} className="panel flex flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="label-xs">{p.device}</span>
                <span
                  className={`border px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em] ${riskStyle[p.risk]}`}
                >
                  {p.risk} RISK
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Icon
                  className={`size-4 ${p.risk === "HIGH" ? "text-critical" : p.risk === "MEDIUM" ? "text-warning" : "text-healthy"}`}
                />
                <h2 className="text-base font-semibold">{p.title}</h2>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confidence</span>
                  <span className="numeric text-foreground">{p.confidence}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-muted">
                  <div
                    className={`h-full ${p.risk === "HIGH" ? "bg-critical" : p.risk === "MEDIUM" ? "bg-warning" : "bg-healthy"}`}
                    style={{ width: `${p.confidence}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="label-xs">Estimated time</div>
                <div className="numeric mt-1 text-sm">{p.eta}</div>
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <div className="label-xs">Recommended action</div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{p.action}</p>
              </div>
            </section>
          );
        })}
      </div>

      <section className="panel p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold tracking-[0.12em]">RISK TREND — LAST 7 DAYS</h2>
          <p className="text-xs text-muted-foreground">
            Composite risk score derived from edge inference and device memory
          </p>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RISK_TREND} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
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
                type="monotone"
                dataKey="Motor #27"
                stroke="var(--chart-5)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Motor #18"
                stroke="var(--chart-4)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Pump #04"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
