import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Status = "HEALTHY" | "WARNING" | "CRITICAL";

export type Device = {
  id: string;
  name: string;
  type: string;
  status: Status;
  health: number;
  temperature: number;
  vibration: number;
  load: number;
  rpm: number;
  power: number;
};

export const BASELINE = {
  temperature: 68,
  vibration: 2.0,
  load: 71,
  rpm: 1480,
  power: 7.7,
};

const MOTOR27_NORMAL: Device = {
  id: "motor-27",
  name: "Motor #27",
  type: "Induction Motor",
  status: "WARNING",
  health: 82,
  temperature: 69,
  vibration: 2.0,
  load: 71,
  rpm: 1480,
  power: 7.9,
};

const MOTOR27_ANOMALY: Device = {
  ...MOTOR27_NORMAL,
  status: "CRITICAL",
  health: 68,
  temperature: 76,
  vibration: 3.2,
  load: 72,
  rpm: 1480,
  power: 8.4,
};

const OTHER_DEVICES: Device[] = [
  {
    id: "motor-18",
    name: "Motor #18",
    type: "Induction Motor",
    status: "WARNING",
    health: 74,
    temperature: 72,
    vibration: 2.8,
    load: 68,
    rpm: 1465,
    power: 8.1,
  },
  {
    id: "pump-04",
    name: "Pump #04",
    type: "Centrifugal Pump",
    status: "HEALTHY",
    health: 94,
    temperature: 61,
    vibration: 1.7,
    load: 62,
    rpm: 1750,
    power: 6.2,
  },
  {
    id: "compressor-12",
    name: "Compressor #12",
    type: "Screw Compressor",
    status: "HEALTHY",
    health: 91,
    temperature: 64,
    vibration: 1.9,
    load: 70,
    rpm: 2950,
    power: 11.3,
  },
];

export type SeriesPoint = {
  t: string;
  temperature: number;
  vibration: number;
  health: number;
};

function buildSeries(anomaly: boolean): SeriesPoint[] {
  const points: SeriesPoint[] = [];
  for (let i = 23; i >= 0; i--) {
    const hour = (24 - i) % 24;
    const label = `${String(hour).padStart(2, "0")}:00`;
    const drift = anomaly ? Math.max(0, (18 - i) / 18) : 0;
    const wobble = Math.sin(i * 0.7) * 0.6;
    points.push({
      t: label,
      temperature: +(67.4 + wobble + drift * 8.4).toFixed(1),
      vibration: +(1.94 + wobble * 0.09 + drift * 1.26).toFixed(2),
      health: Math.round(83 - drift * 15 + wobble * 0.8),
    });
  }
  return points;
}

export const HISTORICAL_PATTERN = [
  { step: "T-18h", historical: 1.98, current: 1.96 },
  { step: "T-15h", historical: 2.08, current: 2.04 },
  { step: "T-12h", historical: 2.24, current: 2.19 },
  { step: "T-9h", historical: 2.51, current: 2.46 },
  { step: "T-6h", historical: 2.78, current: 2.73 },
  { step: "T-3h", historical: 3.04, current: 2.98 },
  { step: "Now", historical: 3.31, current: 3.2 },
];

export const RISK_TREND = [
  { day: "Sep 24", "Motor #27": 22, "Motor #18": 31, "Pump #04": 9 },
  { day: "Sep 25", "Motor #27": 28, "Motor #18": 33, "Pump #04": 8 },
  { day: "Sep 26", "Motor #27": 35, "Motor #18": 36, "Pump #04": 10 },
  { day: "Sep 27", "Motor #27": 46, "Motor #18": 41, "Pump #04": 9 },
  { day: "Sep 28", "Motor #27": 58, "Motor #18": 44, "Pump #04": 11 },
  { day: "Sep 29", "Motor #27": 71, "Motor #18": 48, "Pump #04": 10 },
  { day: "Today", "Motor #27": 86, "Motor #18": 52, "Pump #04": 9 },
];

export const MEMORY_TIMELINE = [
  {
    date: "AUG 14",
    event: "Bearing anomaly detected",
    resolution: "Bearing inspection performed",
    today: false,
  },
  {
    date: "AUG 29",
    event: "Overheating detected",
    resolution: "Cooling system checked",
    today: false,
  },
  {
    date: "SEP 17",
    event: "Vibration spike detected",
    resolution: "Lubrication performed",
    today: false,
  },
  {
    date: "TODAY",
    event: "Similar behavioral pattern detected",
    resolution: "Awaiting operator action",
    today: true,
  },
];

export const EVENT_LOG = [
  { time: "10:42 PM", device: "Motor #27", event: "Behavioral drift detected", level: "critical" },
  { time: "10:38 PM", device: "Motor #18", event: "Temperature anomaly detected", level: "warning" },
  {
    time: "10:21 PM",
    device: "Pump #04",
    event: "Normal operating pattern confirmed",
    level: "healthy",
  },
  { time: "09:57 PM", device: "Motor #27", event: "Historical pattern match found", level: "info" },
];

type Ctx = {
  anomaly: boolean;
  simulate: () => void;
  reset: () => void;
  devices: Device[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  selected: Device;
  series: SeriesPoint[];
};

const EdgePulseContext = createContext<Ctx | null>(null);

export function EdgePulseProvider({ children }: { children: ReactNode }) {
  const [anomaly, setAnomaly] = useState(false);
  const [selectedId, setSelectedId] = useState("motor-27");

  const devices = useMemo(
    () => [anomaly ? MOTOR27_ANOMALY : MOTOR27_NORMAL, ...OTHER_DEVICES],
    [anomaly],
  );
  const selected = (devices.find((d) => d.id === selectedId) ?? devices[0]) as Device;
  const series = useMemo(() => buildSeries(anomaly), [anomaly]);

  const value: Ctx = {
    anomaly,
    simulate: () => setAnomaly(true),
    reset: () => setAnomaly(false),
    devices,
    selectedId,
    setSelectedId,
    selected,
    series,
  };

  return <EdgePulseContext.Provider value={value}>{children}</EdgePulseContext.Provider>;
}

export function useEdgePulse() {
  const ctx = useContext(EdgePulseContext);
  if (!ctx) throw new Error("useEdgePulse must be used inside EdgePulseProvider");
  return ctx;
}

export function statusClass(status: Status) {
  if (status === "CRITICAL") return "text-critical";
  if (status === "WARNING") return "text-warning";
  return "text-healthy";
}

export function statusBg(status: Status) {
  if (status === "CRITICAL") return "bg-critical/12 text-critical border-critical/40";
  if (status === "WARNING") return "bg-warning/12 text-warning border-warning/40";
  return "bg-healthy/12 text-healthy border-healthy/40";
}
