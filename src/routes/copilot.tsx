import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/edge/AppShell";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "AI Copilot — EdgePulse AI" },
      {
        name: "description",
        content:
          "Ask questions about machine health, historical events and predicted risks using local device memory.",
      },
      { property: "og:title", content: "AI Copilot — EdgePulse AI" },
      {
        property: "og:description",
        content: "Ask questions about machine health, historical events and predicted risks.",
      },
    ],
  }),
  component: Copilot,
});

type Msg = { role: "user" | "ai"; text: string };

const INITIAL: Msg[] = [
  { role: "user", text: "Why is Motor #27 at risk?" },
  {
    role: "ai",
    text: "Motor #27 is showing a gradual increase in temperature and vibration. Its current behavior is 82% similar to a previous bearing anomaly stored in its AI memory. The strongest indicators are a 60% increase in vibration and an 11.8% increase in temperature compared with its learned baseline.",
  },
  { role: "user", text: "Have we seen this before?" },
  {
    role: "ai",
    text: "Yes. A similar pattern was recorded on August 14 before a bearing anomaly was identified. The current pattern has an 82% similarity to that historical event.",
  },
  { role: "user", text: "What should I do?" },
  {
    role: "ai",
    text: "Schedule a bearing inspection during the next maintenance cycle. If vibration continues increasing, prioritize the inspection to reduce the risk of unexpected downtime.",
  },
];

const SUGGESTIONS: { q: string; a: string }[] = [
  {
    q: "Why is this machine at risk?",
    a: "Motor #27 has drifted away from its learned operating baseline: vibration is up 60% and temperature up 11.8%. Edge inference classifies this combination as an early mechanical degradation signature with 86% confidence.",
  },
  {
    q: "Have we seen this before?",
    a: "Yes. Device memory holds three prior events for Motor #27: a bearing anomaly (Aug 14), overheating (Aug 29) and a vibration spike (Sep 17). The current pattern matches the Aug 14 bearing anomaly at 82% similarity.",
  },
  {
    q: "What changed?",
    a: "Compared with the learned baseline: temperature 68°C → 76°C (+11.8%), vibration 2.0 → 3.2 mm/s (+60%), power 7.7 → 8.4 kW (+8.4%). Load and RPM remain within normal range, so the change is not explained by higher demand.",
  },
  {
    q: "What action should I take?",
    a: "Schedule a bearing inspection during the next maintenance cycle and re-lubricate if wear is visible. If vibration exceeds 3.5 mm/s before then, escalate to an immediate inspection.",
  },
];

function Copilot() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  const respond = (question: string) => {
    if (!question.trim()) return;
    const match = SUGGESTIONS.find(
      (s) =>
        s.q.toLowerCase() === question.toLowerCase() ||
        question.toLowerCase().includes(s.q.toLowerCase().split(" ")[1] ?? ""),
    );
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            match?.a ??
            "Based on local inference and device memory, Motor #27 is the only asset with an elevated failure signature right now: 86% confidence of a potential bearing failure, 82% similar to the Aug 14 incident. Motor #18 carries a medium overheating risk; Pump #04 and Compressor #12 are operating within their learned baselines.",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="EdgePulse AI Copilot"
        subtitle="Ask questions about machine health, historical events and predicted risks."
      />

      <section className="panel flex h-[60vh] min-h-[420px] flex-col">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Bot className="size-4 text-primary" />
          <span className="text-xs font-semibold tracking-[0.14em]">
            LOCAL INFERENCE · CONTEXT: MOTOR #27
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "ai" && (
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-primary/40 bg-primary/10">
                  <Bot className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] border px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "border-border bg-surface-raised"
                    : "border-primary/25 bg-primary/8"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-border bg-surface-raised">
                  <User className="size-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="pulse-dot size-1.5 rounded-full bg-primary" />
              Running local inference over device memory…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.q}
                onClick={() => respond(s.q)}
                className="border border-border bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {s.q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              respond(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about machine health, memory or predicted risk…"
              className="flex-1 border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="size-4" /> Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
