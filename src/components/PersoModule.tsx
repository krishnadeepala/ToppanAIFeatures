import { useState } from "react";
import {
  Printer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Cpu,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  type LucideProps,
} from "lucide-react";

type PrintStatus = "queued" | "printing" | "done" | "fail" | "finishing";

interface PrintJob {
  id: string;
  appId: string;
  name: string;
  printNumber: string;
  status: PrintStatus;
  progress: number;
  error?: string;
}

const initialJobs: PrintJob[] = [
  { id: "P001", appId: "APP-00000008", name: "Kofi Amponsah", printNumber: "00000008", status: "printing", progress: 64 },
  { id: "P002", appId: "APP-00000007", name: "Adwoa Frimpong", printNumber: "00000007", status: "queued", progress: 0 },
  { id: "P003", appId: "APP-00000006", name: "Nana Yaw Boateng", printNumber: "00000006", status: "done", progress: 100 },
  { id: "P004", appId: "APP-00000005", name: "Akosua Danso", printNumber: "00000005", status: "fail", progress: 37, error: "Ink cartridge low" },
  { id: "P005", appId: "APP-00000004", name: "Kweku Asare", printNumber: "00000004", status: "finishing", progress: 92 },
];

const statusConfig: Record<PrintStatus, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<LucideProps> }> = {
  queued:    { label: "Queued",    color: "#7A9AB8", bg: "rgba(122,154,184,0.08)", border: "rgba(122,154,184,0.2)", icon: Clock },
  printing:  { label: "Printing",  color: "#0068B7", bg: "rgba(0,104,183,0.08)", border: "rgba(0,104,183,0.22)", icon: Printer },
  done:      { label: "Complete",  color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.22)", icon: CheckCircle },
  fail:      { label: "Failed",    color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.22)", icon: XCircle },
  finishing: { label: "Finishing", color: "#0082D6", bg: "rgba(0,130,214,0.08)", border: "rgba(0,130,214,0.22)", icon: Sparkles },
};

export default function PersoModule() {
  const [jobs, setJobs] = useState<PrintJob[]>(initialJobs);
  const [selected, setSelected] = useState<string | null>(null);
  const [printerPaused, setPrinterPaused] = useState(false);

  const selectedJob = jobs.find((j) => j.id === selected);

  const updateJobStatus = (id: string, status: PrintStatus) => {
    setJobs((j) =>
      j.map((job) =>
        job.id === id
          ? { ...job, status, progress: status === "queued" ? 0 : status === "done" ? 100 : job.progress }
          : job
      )
    );
  };

  const failedJobs = jobs.filter((j) => j.status === "fail");
  const activeJobs  = jobs.filter((j) => j.status === "printing").length;
  const completedJobs = jobs.filter((j) => j.status === "done").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Personalisation Module</h2>
          <p className="text-xs" style={{ color: "#7A9AB8" }}>
            Document printing · Perso Finishing · Fail handling
          </p>
        </div>
        <button
          onClick={() => setPrinterPaused(!printerPaused)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: printerPaused ? "rgba(217,119,6,0.08)" : "rgba(0,104,183,0.08)",
            border: `1px solid ${printerPaused ? "rgba(217,119,6,0.25)" : "rgba(0,104,183,0.25)"}`,
            color: printerPaused ? "#d97706" : "#0068B7",
          }}
        >
          {printerPaused ? <Play size={14} /> : <Pause size={14} />}
          {printerPaused ? "Resume Printer" : "Pause Printer"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Jobs",     value: activeJobs.toString(),     color: "#0068B7",            icon: Printer },
          { label: "Completed",       value: completedJobs.toString(),  color: "#16a34a",            icon: CheckCircle },
          { label: "Failed",          value: failedJobs.length.toString(), color: "#dc2626",         icon: XCircle },
          { label: "Printer Status",  value: printerPaused ? "PAUSED" : "ONLINE", color: printerPaused ? "#d97706" : "#16a34a", icon: Cpu },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}28` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div
                className="text-xl font-bold"
                style={{ color, fontFamily: label === "Printer Status" ? "'DM Mono', monospace" : undefined, fontSize: label === "Printer Status" ? "13px" : undefined }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: "#7A9AB8" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Printer Visual */}
      <div className="rounded-2xl p-5 mb-6 relative overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ background: "repeating-linear-gradient(90deg, #0068B7 0px, #0068B7 1px, transparent 1px, transparent 40px)" }}
        />
        <div className="relative flex items-center gap-6">
          <div
            className="flex-shrink-0 rounded-xl p-4 flex items-center justify-center"
            style={{
              background: printerPaused ? "rgba(217,119,6,0.07)" : "rgba(0,104,183,0.07)",
              border: `1px solid ${printerPaused ? "rgba(217,119,6,0.2)" : "rgba(0,104,183,0.2)"}`,
              width: "80px", height: "80px",
            }}
          >
            <Printer size={32} style={{ color: printerPaused ? "#d97706" : "#0068B7" }} className={printerPaused ? "" : "ai-pulse"} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ color: "#0D1B2A" }}>IDS Perso Printer · Unit 01</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: printerPaused ? "rgba(217,119,6,0.08)" : "rgba(22,163,74,0.08)",
                  color: printerPaused ? "#d97706" : "#16a34a",
                  border: `1px solid ${printerPaused ? "rgba(217,119,6,0.22)" : "rgba(22,163,74,0.22)"}`,
                }}
              >
                {printerPaused ? "Paused" : "Online"}
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: "#7A9AB8" }}>
              Printing job{" "}
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#0082D6" }}>
                {jobs.find((j) => j.status === "printing")?.printNumber || "–"}
              </span>{" "}
              · Application{" "}
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#0082D6" }}>
                {jobs.find((j) => j.status === "printing")?.appId || "–"}
              </span>
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full" style={{ background: "#EAF1F8" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${jobs.find((j) => j.status === "printing")?.progress ?? 0}%`, background: "#0068B7" }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: "#0082D6" }}>
                {jobs.find((j) => j.status === "printing")?.progress ?? 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Queue */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#D6E2EE" }}>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>Print Queue</span>
              <button className="text-xs flex items-center gap-1" style={{ color: "#7A9AB8" }}>
                <SkipForward size={12} /> Skip failed
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: "#F3F7FB" }}>
              {jobs.map((job) => {
                const sc = statusConfig[job.status];
                const Icon = sc.icon;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelected(job.id === selected ? null : job.id)}
                    className="w-full px-4 py-4 text-left transition-all"
                    style={{
                      background: selected === job.id ? "rgba(0,104,183,0.05)" : "#FFFFFF",
                      borderLeftWidth: "2px",
                      borderLeftStyle: "solid",
                      borderLeftColor: selected === job.id ? "#0068B7" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (selected !== job.id) (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                    onMouseLeave={(e) => { if (selected !== job.id) (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
                        <Icon size={16} style={{ color: sc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono" style={{ color: "#7A9AB8", fontSize: "10px" }}>{job.appId}</span>
                          <span className="text-xs font-mono" style={{ color: "#0068B7", fontSize: "10px" }}>Print #{job.printNumber}</span>
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>{job.name}</div>
                        {(job.status === "printing" || job.status === "finishing") && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1 rounded-full" style={{ background: "#EAF1F8" }}>
                              <div className="h-full rounded-full" style={{ width: `${job.progress}%`, background: sc.color }} />
                            </div>
                            <span className="text-xs font-mono" style={{ color: sc.color, fontSize: "10px" }}>{job.progress}%</span>
                          </div>
                        )}
                        {job.error && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{job.error}</p>}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div>
          {selectedJob ? (
            <div className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7A9AB8" }}>Job Actions</h3>
              <div className="mb-4">
                <div className="text-xs font-mono mb-1" style={{ color: "#0068B7" }}>{selectedJob.appId}</div>
                <div className="text-sm font-bold" style={{ color: "#0D1B2A" }}>{selectedJob.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>Print #{selectedJob.printNumber}</div>
              </div>

              <div className="space-y-2">
                {selectedJob.status === "fail" && (
                  <>
                    <button
                      onClick={() => updateJobStatus(selectedJob.id, "printing")}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all btn-primary"
                    >
                      <RefreshCw size={14} />
                      Re-Print Job
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626" }}
                    >
                      <XCircle size={14} />
                      Mark Perso Fail → QA
                    </button>
                  </>
                )}

                {selectedJob.status === "finishing" && (
                  <button
                    onClick={() => updateJobStatus(selectedJob.id, "done")}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
                  >
                    <CheckCircle size={14} />
                    Confirm Perso Finishing
                  </button>
                )}

                {selectedJob.status === "queued" && (
                  <button
                    onClick={() => updateJobStatus(selectedJob.id, "printing")}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all btn-primary"
                  >
                    <Play size={14} />
                    Start Printing
                  </button>
                )}

                {selectedJob.status === "done" && (
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)" }}>
                    <CheckCircle size={20} style={{ color: "#16a34a", margin: "0 auto 8px" }} />
                    <p className="text-xs font-semibold" style={{ color: "#16a34a" }}>Job Complete</p>
                    <p className="text-xs mt-1" style={{ color: "#7A9AB8" }}>Forwarded to QA queue</p>
                  </div>
                )}

                {selectedJob.status === "printing" && (
                  <div className="rounded-xl p-4" style={{ background: "rgba(0,104,183,0.05)", border: "1px solid rgba(0,104,183,0.15)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Printer size={13} style={{ color: "#0068B7" }} className="ai-pulse" />
                      <span className="text-xs font-semibold" style={{ color: "#0068B7" }}>Printing in Progress</span>
                    </div>
                    <p className="text-xs" style={{ color: "#7A9AB8" }}>
                      {selectedJob.progress}% complete. Est. 2m 14s remaining.
                    </p>
                  </div>
                )}
              </div>

              {/* AI Quality Pre-check */}
              <div className="mt-4 rounded-xl p-3" style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.14)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={11} style={{ color: "#0082D6" }} />
                  <span className="text-xs" style={{ color: "#0082D6" }}>AI Print Quality</span>
                </div>
                <div className="space-y-1">
                  {["Ink coverage", "Alignment", "Data integrity"].map((label, i) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs" style={{ color: "#7A9AB8" }}>{label}</span>
                      <span className="text-xs font-mono" style={{ color: [98, 100, 100][i] > 90 ? "#16a34a" : "#d97706" }}>
                        {[98, 100, 100][i]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl flex items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE", minHeight: "300px" }}>
              <div className="text-center">
                <Printer size={28} style={{ color: "#D6E2EE", margin: "0 auto 8px" }} />
                <p className="text-xs" style={{ color: "#B3CAE0" }}>Select a job to see actions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
