import { useState } from "react";
import {
  RotateCcw,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  Printer,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

interface RePersoItem {
  id: string;
  appId: string;
  printNumber: string;
  name: string;
  reason: string;
  origin: "QA Reject" | "Perso Fail";
  aiDiagnosis: string;
  status: "pending" | "reprinting" | "verified" | "re-rejected";
  attempt: number;
}

const items: RePersoItem[] = [
  {
    id: "R001",
    appId: "APP-00000005",
    printNumber: "00000005",
    name: "Akosua Danso",
    reason: "RFID chip encoding error & hologram misaligned",
    origin: "QA Reject",
    aiDiagnosis: "Chip error likely caused by voltage spike during encoding. Recommend firmware update before re-print.",
    status: "pending",
    attempt: 2,
  },
  {
    id: "R002",
    appId: "APP-00000002",
    printNumber: "00000002",
    name: "Kofi Mensa",
    reason: "Ink cartridge low — incomplete print",
    origin: "Perso Fail",
    aiDiagnosis: "Cartridge replaced. Re-print should succeed. All other parameters nominal.",
    status: "pending",
    attempt: 1,
  },
];

export default function RePersoModule() {
  const [jobs, setJobs] = useState<RePersoItem[]>(items);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedJob = jobs.find((j) => j.id === selected);

  const updateStatus = (id: string, status: RePersoItem["status"]) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    if (status === "reprinting") {
      setTimeout(() => {
        setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "verified" } : j)));
      }, 3000);
    }
  };

  const pending   = jobs.filter((j) => j.status === "pending");
  const completed = jobs.filter((j) => j.status !== "pending");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Re-Personalisation</h2>
          <p className="text-xs" style={{ color: "#7A9AB8" }}>
            Reprint failed documents · Verify in Perso Module
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs"
          style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.22)", color: "#d97706" }}
        >
          {pending.length} awaiting re-perso
        </div>
      </div>

      {/* Flow Banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 overflow-x-auto"
        style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
      >
        {[
          { label: "QA Reject / Perso Fail", color: "#dc2626", icon: AlertTriangle },
          { label: "Re-Perso Queue",          color: "#d97706", icon: RotateCcw },
          { label: "AI Diagnosis",            color: "#0082D6", icon: Sparkles },
          { label: "Re-Print",               color: "#0068B7", icon: Printer },
          { label: "Verify in Perso",         color: "#16a34a", icon: ClipboardCheck },
        ].map(({ label, color, icon: Icon }, i, arr) => (
          <div key={label} className="flex items-center gap-3 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: `${color}09`, border: `1px solid ${color}22` }}
            >
              <Icon size={13} style={{ color }} />
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
            </div>
            {i < arr.length - 1 && <ArrowRight size={14} style={{ color: "#D6E2EE" }} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "#D6E2EE" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>
                Re-Perso Queue
              </span>
            </div>

            {[...pending, ...completed].map((job) => {
              const isDone = job.status !== "pending";
              return (
                <button
                  key={job.id}
                  onClick={() => !isDone && setSelected(job.id === selected ? null : job.id)}
                  className="w-full px-4 py-4 border-b text-left transition-all"
                  style={{
                    borderBottomColor: "#F3F7FB",
                    opacity: isDone ? 0.6 : 1,
                    background: selected === job.id ? "rgba(0,104,183,0.05)" : "#FFFFFF",
                    borderLeftWidth: "2px",
                    borderLeftStyle: "solid",
                    borderLeftColor: selected === job.id ? "#0068B7" : "transparent",
                    cursor: isDone ? "default" : "pointer",
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-xs font-mono" style={{ color: "#0068B7", fontSize: "10px" }}>{job.appId}</div>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: job.origin === "QA Reject" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
                        color: job.origin === "QA Reject" ? "#dc2626" : "#d97706",
                        fontSize: "9px",
                      }}
                    >
                      {job.origin}
                    </span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>{job.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>Attempt #{job.attempt}</div>
                  <div className="mt-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          job.status === "verified"    ? "rgba(22,163,74,0.08)"   :
                          job.status === "reprinting"  ? "rgba(0,104,183,0.08)"   :
                          job.status === "re-rejected" ? "rgba(220,38,38,0.08)"   :
                                                         "rgba(217,119,6,0.08)",
                        color:
                          job.status === "verified"    ? "#16a34a" :
                          job.status === "reprinting"  ? "#0082D6" :
                          job.status === "re-rejected" ? "#dc2626" :
                                                         "#d97706",
                      }}
                    >
                      {job.status === "pending"     ? "Awaiting Re-Perso" :
                       job.status === "reprinting"  ? "Reprinting…"       :
                       job.status === "verified"    ? "Verified ✓"         :
                                                      "Re-Rejected"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail + Actions */}
        <div className="lg:col-span-2">
          {!selectedJob ? (
            <div className="rounded-2xl flex items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE", minHeight: "400px" }}>
              <div className="text-center">
                <RotateCcw size={32} style={{ color: "#D6E2EE", margin: "0 auto 12px" }} />
                <p className="text-sm" style={{ color: "#B3CAE0" }}>Select a job to manage re-perso</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono mb-1" style={{ color: "#0068B7" }}>
                      {selectedJob.appId} · Print #{selectedJob.printNumber}
                    </div>
                    <h3 className="text-base font-bold" style={{ color: "#0D1B2A" }}>{selectedJob.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>
                      Attempt #{selectedJob.attempt} · {selectedJob.origin}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: selectedJob.origin === "QA Reject" ? "rgba(220,38,38,0.07)" : "rgba(217,119,6,0.07)",
                      color: selectedJob.origin === "QA Reject" ? "#dc2626" : "#d97706",
                      border: `1px solid ${selectedJob.origin === "QA Reject" ? "rgba(220,38,38,0.2)" : "rgba(217,119,6,0.2)"}`,
                    }}
                  >
                    {selectedJob.origin}
                  </span>
                </div>

                {/* Failure Reason */}
                <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.14)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={13} style={{ color: "#dc2626" }} />
                    <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>Failure Reason</span>
                  </div>
                  <p className="text-xs" style={{ color: "#3D5872" }}>{selectedJob.reason}</p>
                </div>

                {/* AI Diagnosis */}
                <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.14)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={13} style={{ color: "#0082D6" }} />
                    <span className="text-xs font-semibold" style={{ color: "#0082D6" }}>AI Root Cause Analysis</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,104,183,0.1)", color: "#0082D6", fontSize: "9px" }}>
                      GEMINI-VISION
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#3D5872" }}>{selectedJob.aiDiagnosis}</p>
                </div>

                {selectedJob.status === "reprinting" && (
                  <div className="rounded-xl p-4 mb-4 flex items-center gap-3" style={{ background: "rgba(0,104,183,0.06)", border: "1px solid rgba(0,104,183,0.18)" }}>
                    <Printer size={18} style={{ color: "#0068B7" }} className="ai-pulse" />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#0068B7" }}>Re-printing in progress…</p>
                      <p className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>Will move to Perso Verification automatically</p>
                    </div>
                  </div>
                )}

                {selectedJob.status === "verified" && (
                  <div className="rounded-xl p-4 mb-4 flex items-center gap-3 status-glow-green" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.22)" }}>
                    <CheckCircle size={18} style={{ color: "#16a34a" }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#16a34a" }}>Verified in Perso Module</p>
                      <p className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>Re-perso complete. Forwarded to dispatch.</p>
                    </div>
                  </div>
                )}

                {selectedJob.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(selectedJob.id, "reprinting")}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white btn-primary"
                    >
                      <Printer size={14} />
                      Start Re-Print
                    </button>
                    <button
                      onClick={() => updateStatus(selectedJob.id, "re-rejected")}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626" }}
                    >
                      <AlertTriangle size={14} />
                      Escalate
                    </button>
                  </div>
                )}

                {selectedJob.status === "verified" && (
                  <div className="grid grid-cols-3 gap-3">
                    {["Biometric Match", "Chip Read", "Visual OK"].map((label) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
                        style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)" }}
                      >
                        <CheckCircle size={16} style={{ color: "#16a34a" }} />
                        <span className="text-xs" style={{ color: "#16a34a" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
