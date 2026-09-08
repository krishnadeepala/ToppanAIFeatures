import {
  FileText,
  Scale,
  Printer,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Activity,
  ArrowRight,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Role } from "./shared/AppShell";

const flowSteps = [
  { label: "Enrolment", count: 14, color: "#0068B7", icon: FileText, sub: "4 Paper · 10 In-Person" },
  { label: "Adjudication", count: 7, color: "#0068B7", icon: Scale, sub: "3 High Risk" },
  { label: "Perso", count: 5, color: "#00A3D4", icon: Printer, sub: "1 Printing Now" },
  { label: "QA", count: 3, color: "#16a34a", icon: ShieldCheck, sub: "2 Pending Inspect" },
  { label: "Re-Perso", count: 2, color: "#d97706", icon: RotateCcw, sub: "From QA Reject" },
];

const recentActivity = [
  { time: "09:31", text: "APP-00000012 flagged high-risk by AI (72%)", type: "warning" },
  { time: "09:28", text: "APP-00000006 passed QA — approved for dispatch", type: "success" },
  { time: "09:14", text: "APP-00000011 submitted via In-Person channel", type: "info" },
  { time: "09:02", text: "Perso Fail on Print #00000005 — re-perso queued", type: "error" },
  { time: "08:55", text: "AI extracted data from APP-00000010 (99.1% conf.)", type: "ai" },
  { time: "08:43", text: "APP-00000009 adjudicated — approved", type: "success" },
];

const activityColor: Record<string, string> = {
  warning: "#d97706",
  success: "#16a34a",
  info: "#0068B7",
  error: "#dc2626",
  ai: "#0082D6",
};

const roleMetrics: Record<Role, { label: string; value: string; color: string; icon: React.ComponentType<LucideProps> }[]> = {
  enrolment: [
    { label: "My Submissions Today", value: "14", color: "#0068B7", icon: FileText },
    { label: "AI Extraction Rate", value: "98.4%", color: "#0082D6", icon: Sparkles },
    { label: "Avg. Process Time", value: "4.2m", color: "#16a34a", icon: Clock },
    { label: "Pending Adjudication", value: "7", color: "#d97706", icon: Scale },
  ],
  adjudicator: [
    { label: "Pending Review", value: "7", color: "#0068B7", icon: Scale },
    { label: "Approved Today", value: "23", color: "#16a34a", icon: CheckCircle },
    { label: "High-Risk Flagged", value: "3", color: "#dc2626", icon: AlertTriangle },
    { label: "AI Assist Rate", value: "94.7%", color: "#0082D6", icon: Sparkles },
  ],
  perso: [
    { label: "Jobs in Queue", value: "5", color: "#00A3D4", icon: Printer },
    { label: "Completed Today", value: "18", color: "#16a34a", icon: CheckCircle },
    { label: "Failed Jobs", value: "1", color: "#dc2626", icon: AlertTriangle },
    { label: "AI Quality Pre-Check", value: "100%", color: "#0082D6", icon: Sparkles },
  ],
  qa: [
    { label: "Pending Inspection", value: "3", color: "#16a34a", icon: ShieldCheck },
    { label: "Approved Today", value: "15", color: "#16a34a", icon: CheckCircle },
    { label: "Re-Perso Triggered", value: "2", color: "#d97706", icon: RotateCcw },
    { label: "AI Quality Score Avg", value: "91.4", color: "#0082D6", icon: Sparkles },
  ],
  admin: [
    { label: "Total Applications", value: "47", color: "#0068B7", icon: FileText },
    { label: "In Flow", value: "31", color: "#00A3D4", icon: Activity },
    { label: "Completed Today", value: "16", color: "#16a34a", icon: CheckCircle },
    { label: "Errors / Flags", value: "4", color: "#dc2626", icon: AlertTriangle },
  ],
};

interface DashboardProps {
  role: Role;
}

export default function Dashboard({ role }: DashboardProps) {
  const metrics = roleMetrics[role];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Overview</h2>
        <p className="text-xs" style={{ color: "#7A9AB8" }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · IDS Application Flow
        </p>
      </div>

      {/* Role Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}12`, border: `1px solid ${color}28` }}
              >
                <Icon size={15} style={{ color }} />
              </div>
              <TrendingUp size={13} style={{ color: "#16a34a" }} />
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
            <div className="text-xs" style={{ color: "#7A9AB8" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Application Flow Pipeline */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>
            Live Application Pipeline
          </h3>
          <div className="flex items-center gap-1.5 text-xs ai-badge px-2.5 py-1 rounded-full" style={{ color: "#0082D6" }}>
            <Sparkles size={11} />
            AI Monitoring
          </div>
        </div>

        <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="rounded-xl p-4 flex flex-col items-center text-center"
                  style={{
                    background: `${step.color}08`,
                    border: `1px solid ${step.color}22`,
                    minWidth: "120px",
                  }}
                >
                  <Icon size={18} style={{ color: step.color }} />
                  <div className="text-xl font-bold mt-2 mb-0.5" style={{ color: step.color }}>
                    {step.count}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: "#0D1B2A" }}>{step.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7A9AB8", fontSize: "10px" }}>
                    {step.sub}
                  </div>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight size={16} style={{ color: "#D6E2EE", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Total progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs" style={{ color: "#7A9AB8" }}>Total processed today</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EAF1F8" }}>
            {flowSteps.map((step, i) => (
              <div
                key={step.label}
                className="h-full rounded-full inline-block"
                style={{
                  width: `${(step.count / 31) * 100}%`,
                  background: step.color,
                  opacity: 0.6 + i * 0.08,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono" style={{ color: "#3D5872" }}>31 / 47</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl"
            style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
          >
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#D6E2EE" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>
                Live Activity
              </span>
              <Activity size={13} style={{ color: "#16a34a" }} className="ai-pulse" />
            </div>
            <div className="divide-y" style={{ borderColor: "#F3F7FB" }}>
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: activityColor[a.type] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: "#0D1B2A" }}>{a.text}</p>
                  </div>
                  <span
                    className="text-xs flex-shrink-0 font-mono"
                    style={{ color: "#B3CAE0", fontSize: "10px" }}
                  >
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} style={{ color: "#0082D6" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>
                AI Insights
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Risk Spike Detected",
                  body: "3 high-risk applications in adjudication queue. Manual review recommended.",
                  color: "#dc2626",
                  icon: AlertTriangle,
                },
                {
                  title: "Perso Efficiency",
                  body: "Printer throughput 12% above baseline. Ink levels nominal.",
                  color: "#16a34a",
                  icon: TrendingUp,
                },
                {
                  title: "Channel Insight",
                  body: "In-Person applications have 34% lower risk score than Paper this week.",
                  color: "#0082D6",
                  icon: Sparkles,
                },
              ].map(({ title, body, color, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-xl p-3"
                  style={{ background: `${color}07`, border: `1px solid ${color}1A` }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} style={{ color }} />
                    <span className="text-xs font-semibold" style={{ color }}>{title}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#3D5872" }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
