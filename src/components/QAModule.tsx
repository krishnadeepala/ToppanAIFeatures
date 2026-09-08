import { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Microscope,
} from "lucide-react";

interface QAItem {
  id: string;
  appId: string;
  printNumber: string;
  name: string;
  aiQualityScore: number;
  checks: { label: string; pass: boolean; detail: string }[];
  status: "pending" | "approved" | "rejected" | "reperso";
}

const qaQueue: QAItem[] = [
  {
    id: "Q001",
    appId: "APP-00000006",
    printNumber: "00000006",
    name: "Nana Yaw Boateng",
    aiQualityScore: 97,
    checks: [
      { label: "Photo Quality",     pass: true,  detail: "High-resolution, no blur" },
      { label: "Data Accuracy",     pass: true,  detail: "All fields match application" },
      { label: "Chip Encoding",     pass: true,  detail: "RFID chip verified" },
      { label: "Signature Strip",   pass: true,  detail: "Signature captured correctly" },
      { label: "Security Features", pass: true,  detail: "Hologram, UV ink validated" },
    ],
    status: "pending",
  },
  {
    id: "Q002",
    appId: "APP-00000005",
    printNumber: "00000005",
    name: "Akosua Danso",
    aiQualityScore: 68,
    checks: [
      { label: "Photo Quality",     pass: true,  detail: "Acceptable quality" },
      { label: "Data Accuracy",     pass: true,  detail: "Fields verified" },
      { label: "Chip Encoding",     pass: false, detail: "RFID read error — 3 attempts" },
      { label: "Signature Strip",   pass: true,  detail: "OK" },
      { label: "Security Features", pass: false, detail: "Hologram misaligned" },
    ],
    status: "pending",
  },
  {
    id: "Q003",
    appId: "APP-00000004",
    printNumber: "00000004",
    name: "Kweku Asare",
    aiQualityScore: 91,
    checks: [
      { label: "Photo Quality",     pass: true,  detail: "Clear and well-lit" },
      { label: "Data Accuracy",     pass: true,  detail: "All fields match" },
      { label: "Chip Encoding",     pass: true,  detail: "Verified" },
      { label: "Signature Strip",   pass: false, detail: "Slight smear detected" },
      { label: "Security Features", pass: true,  detail: "All features present" },
    ],
    status: "pending",
  },
];

const scoreColor = (s: number) => {
  if (s >= 90) return { color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.22)", label: "Excellent" };
  if (s >= 70) return { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.22)", label: "Acceptable" };
  return { color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.22)", label: "Poor" };
};

export default function QAModule() {
  const [items, setItems] = useState<QAItem[]>(qaQueue);
  const [selected, setSelected] = useState<string | null>(null);
  const [aiRunning, setAiRunning] = useState(false);

  const selectedItem = items.find((i) => i.id === selected);

  const handleDecision = (id: string, decision: "approved" | "rejected" | "reperso") => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: decision } : i)));
    setSelected(null);
  };

  const runAI = () => {
    setAiRunning(true);
    setTimeout(() => setAiRunning(false), 1800);
  };

  const pending   = items.filter((i) => i.status === "pending");
  const completed = items.filter((i) => i.status !== "pending");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Quality Assurance</h2>
          <p className="text-xs" style={{ color: "#7A9AB8" }}>
            Inspect personalised documents · AI-assisted quality checks
          </p>
        </div>
        <button
          onClick={runAI}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ai-badge transition-all"
          style={{ color: "#0082D6" }}
        >
          {aiRunning ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-blue-300/40 border-t-blue-400 animate-spin" />
              Running AI Inspection…
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Run AI Batch Inspection
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending QA",  value: pending.length.toString(),                                    color: "#0068B7", icon: Microscope },
          { label: "Approved",    value: completed.filter((c) => c.status === "approved").length.toString(), color: "#16a34a", icon: ThumbsUp },
          { label: "Rejected",    value: completed.filter((c) => c.status === "rejected").length.toString(), color: "#dc2626", icon: ThumbsDown },
          { label: "Re-Perso",    value: completed.filter((c) => c.status === "reperso").length.toString(),  color: "#d97706", icon: RotateCcw },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}28` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs" style={{ color: "#7A9AB8" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Queue */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "#D6E2EE" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>QA Queue</span>
            </div>

            <div>
              {pending.length === 0 && (
                <div className="text-center py-10">
                  <ShieldCheck size={28} style={{ color: "#16a34a", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ color: "#0D1B2A" }}>All inspected</p>
                </div>
              )}
              {pending.map((item) => {
                const sc = scoreColor(item.aiQualityScore);
                const failCount = item.checks.filter((c) => !c.pass).length;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item.id === selected ? null : item.id)}
                    className="w-full px-4 py-4 text-left border-b transition-all"
                    style={{
                      borderBottomColor: "#F3F7FB",
                      background: selected === item.id ? "rgba(0,104,183,0.05)" : "#FFFFFF",
                      borderLeftWidth: "2px",
                      borderLeftStyle: "solid",
                      borderLeftColor: selected === item.id ? "#0068B7" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (selected !== item.id) (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                    onMouseLeave={(e) => { if (selected !== item.id) (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                        <span className="text-sm font-bold" style={{ color: sc.color, lineHeight: 1 }}>{item.aiQualityScore}</span>
                        <span style={{ color: sc.color, fontSize: "8px" }}>AI</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono mb-0.5" style={{ color: "#7A9AB8", fontSize: "10px" }}>
                          {item.appId} · Print #{item.printNumber}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>{item.name}</div>
                        {failCount > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertTriangle size={10} style={{ color: "#d97706" }} />
                            <span className="text-xs" style={{ color: "#d97706" }}>
                              {failCount} check{failCount > 1 ? "s" : ""} failed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {completed.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b flex items-center gap-3 opacity-50" style={{ borderColor: "#F3F7FB" }}>
                  {item.status === "approved" ? (
                    <CheckCircle size={14} style={{ color: "#16a34a" }} />
                  ) : item.status === "rejected" ? (
                    <XCircle size={14} style={{ color: "#dc2626" }} />
                  ) : (
                    <RotateCcw size={14} style={{ color: "#d97706" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate" style={{ color: "#0D1B2A" }}>{item.name}</div>
                    <div className="text-xs capitalize" style={{ color: "#7A9AB8" }}>{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {!selectedItem ? (
            <div className="rounded-2xl flex items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE", minHeight: "420px" }}>
              <div className="text-center">
                <ShieldCheck size={32} style={{ color: "#D6E2EE", margin: "0 auto 12px" }} />
                <p className="text-sm" style={{ color: "#B3CAE0" }}>Select a document to inspect</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-xs font-mono mb-1" style={{ color: "#0068B7" }}>
                    {selectedItem.appId} · Print #{selectedItem.printNumber}
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "#0D1B2A" }}>{selectedItem.name}</h3>
                </div>
                <div
                  className="flex flex-col items-center justify-center w-14 h-14 rounded-xl"
                  style={{ background: scoreColor(selectedItem.aiQualityScore).bg, border: `1px solid ${scoreColor(selectedItem.aiQualityScore).border}` }}
                >
                  <span className="text-xl font-bold" style={{ color: scoreColor(selectedItem.aiQualityScore).color, lineHeight: 1 }}>
                    {selectedItem.aiQualityScore}
                  </span>
                  <span style={{ color: scoreColor(selectedItem.aiQualityScore).color, fontSize: "9px" }}>AI Score</span>
                </div>
              </div>

              {/* Document Preview */}
              <div
                className="rounded-xl mb-5 flex items-center justify-center"
                style={{ height: "120px", background: "#F8FAFC", border: "1px dashed #D6E2EE", position: "relative", overflow: "hidden" }}
              >
                <div
                  className="rounded-lg px-5 py-3 flex items-center gap-4"
                  style={{ background: "linear-gradient(135deg, #EAF1F8, #F3F7FB)", border: "1px solid #D6E2EE", width: "280px" }}
                >
                  <div className="w-10 h-12 rounded flex-shrink-0" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: "#0D1B2A" }}>{selectedItem.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#7A9AB8", fontFamily: "'DM Mono', monospace", fontSize: "9px" }}>
                      #{selectedItem.printNumber}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {selectedItem.checks.map((c, i) => (
                        <div key={i} className="w-2 h-2 rounded-full" style={{ background: c.pass ? "#16a34a" : "#dc2626" }} title={c.label} />
                      ))}
                    </div>
                  </div>
                  <Eye size={14} style={{ color: "#B3CAE0", marginLeft: "auto" }} />
                </div>
              </div>

              {/* AI Quality Checks */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} style={{ color: "#0082D6" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0082D6" }}>AI Quality Checks</span>
                </div>
                <div className="space-y-2">
                  {selectedItem.checks.map((check) => (
                    <div
                      key={check.label}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{
                        background: check.pass ? "rgba(22,163,74,0.04)" : "rgba(220,38,38,0.04)",
                        border: `1px solid ${check.pass ? "rgba(22,163,74,0.14)" : "rgba(220,38,38,0.14)"}`,
                      }}
                    >
                      {check.pass ? (
                        <CheckCircle size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                      ) : (
                        <XCircle size={14} style={{ color: "#dc2626", flexShrink: 0 }} />
                      )}
                      <div className="flex-1">
                        <span className="text-xs font-medium" style={{ color: check.pass ? "#16a34a" : "#dc2626" }}>
                          {check.label}
                        </span>
                        <span className="text-xs ml-2" style={{ color: "#7A9AB8" }}>{check.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDecision(selectedItem.id, "approved")}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.22)", color: "#16a34a" }}
                >
                  <ThumbsUp size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(selectedItem.id, "reperso")}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.2)", color: "#d97706" }}
                >
                  <RotateCcw size={16} />
                  Re-Perso
                </button>
                <button
                  onClick={() => handleDecision(selectedItem.id, "rejected")}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626" }}
                >
                  <ThumbsDown size={16} />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
