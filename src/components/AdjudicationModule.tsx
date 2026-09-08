import { useState } from "react";
import {
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  FileText,
  Camera,
  User,
  Hash,
  Calendar,
  Globe,
  MapPin,
  Fingerprint,
  ShieldAlert,
  ShieldCheck,
  Eye,
  ScanLine,
  TriangleAlert,
} from "lucide-react";

type Decision = "approve" | "reject" | "text-recapture" | "image-recapture" | null;
type FlowStep = "overview" | "documents" | "ai-analysis" | "decision";

interface Application {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  idNumber: string;
  address: string;
  gender: string;
  channel: "Paper" | "In-Person";
  submitted: string;
  aiRisk: number;
  aiFlags: string[];
  priority: "high" | "normal" | "low";
  aiScores: {
    biometricMatch: number;
    documentAuthenticity: number;
    dataConsistency: number;
    duplicateCheck: number;
    signatureVerification: number;
    livelinessCheck: number;
  };
  aiRecommendation: string;
  documentNotes: string;
}

const applications: Application[] = [
  {
    id: "APP-00000012",
    name: "Kwame Asante-Boateng",
    firstName: "Kwame",
    lastName: "Asante-Boateng",
    dob: "1985-06-22",
    nationality: "GHA",
    idNumber: "GHA-2024-001291",
    address: "45 Ring Road East, Accra",
    gender: "Male",
    channel: "Paper",
    submitted: "08:45",
    aiRisk: 72,
    aiFlags: ["Signature mismatch", "DOB inconsistency"],
    priority: "high",
    aiScores: { biometricMatch: 61, documentAuthenticity: 43, dataConsistency: 55, duplicateCheck: 100, signatureVerification: 34, livelinessCheck: 88 },
    aiRecommendation: "Reject or escalate — multiple verification failures detected.",
    documentNotes: "Signature on form differs significantly from reference database. DOB on form reads 1985 but supporting document shows 1983.",
  },
  {
    id: "APP-00000011",
    name: "Efua Mensah",
    firstName: "Efua",
    lastName: "Mensah",
    dob: "1992-11-03",
    nationality: "GHA",
    idNumber: "GHA-2024-001290",
    address: "12 Labone Crescent, Accra",
    gender: "Female",
    channel: "In-Person",
    submitted: "08:32",
    aiRisk: 18,
    aiFlags: [],
    priority: "normal",
    aiScores: { biometricMatch: 97, documentAuthenticity: 99, dataConsistency: 98, duplicateCheck: 100, signatureVerification: 96, livelinessCheck: 99 },
    aiRecommendation: "Approve — all checks passed with high confidence.",
    documentNotes: "All documents verified. In-person biometric capture successful.",
  },
  {
    id: "APP-00000010",
    name: "Yaw Darko",
    firstName: "Yaw",
    lastName: "Darko",
    dob: "1978-02-14",
    nationality: "GHA",
    idNumber: "GHA-2024-001289",
    address: "7 Spintex Road, Tema",
    gender: "Male",
    channel: "Paper",
    submitted: "08:10",
    aiRisk: 44,
    aiFlags: ["Image quality: low"],
    priority: "normal",
    aiScores: { biometricMatch: 74, documentAuthenticity: 81, dataConsistency: 90, duplicateCheck: 100, signatureVerification: 88, livelinessCheck: 62 },
    aiRecommendation: "Manual review required — photo quality below threshold, consider image recapture.",
    documentNotes: "Scanned photo has low resolution (below 300 DPI). All text data fields consistent.",
  },
  {
    id: "APP-00000009",
    name: "Abena Kyei",
    firstName: "Abena",
    lastName: "Kyei",
    dob: "2001-08-30",
    nationality: "GHA",
    idNumber: "GHA-2024-001288",
    address: "3 Airport Hills, Accra",
    gender: "Female",
    channel: "In-Person",
    submitted: "07:55",
    aiRisk: 9,
    aiFlags: [],
    priority: "low",
    aiScores: { biometricMatch: 99, documentAuthenticity: 100, dataConsistency: 99, duplicateCheck: 100, signatureVerification: 97, livelinessCheck: 100 },
    aiRecommendation: "Approve — excellent match across all verification dimensions.",
    documentNotes: "Clean application. No anomalies detected.",
  },
  {
    id: "APP-00000008",
    name: "Kofi Amponsah",
    firstName: "Kofi",
    lastName: "Amponsah",
    dob: "1970-12-05",
    nationality: "GHA",
    idNumber: "GHA-2024-001287",
    address: "22 Liberation Road, Accra",
    gender: "Male",
    channel: "Paper",
    submitted: "07:40",
    aiRisk: 61,
    aiFlags: ["Duplicate record detected"],
    priority: "high",
    aiScores: { biometricMatch: 89, documentAuthenticity: 85, dataConsistency: 77, duplicateCheck: 18, signatureVerification: 91, livelinessCheck: 84 },
    aiRecommendation: "Hold — possible duplicate identity. Cross-reference APP-00000003 before proceeding.",
    documentNotes: "Biometrics closely match existing record GHA-2019-004421. Requires manual identity de-duplication.",
  },
];

const FLOW_STEPS: { id: FlowStep; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "ai-analysis", label: "AI Analysis" },
  { id: "decision", label: "Decision" },
];

const riskGradient = (r: number) => {
  if (r < 30) return { color: "#16a34a", bg: "rgba(22,163,74,0.07)", border: "rgba(22,163,74,0.2)", label: "Low Risk" };
  if (r < 60) return { color: "#d97706", bg: "rgba(217,119,6,0.07)", border: "rgba(217,119,6,0.2)", label: "Medium Risk" };
  return { color: "#dc2626", bg: "rgba(220,38,38,0.07)", border: "rgba(220,38,38,0.2)", label: "High Risk" };
};

const scoreColor = (s: number) => (s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626");

const decisionOptions: { id: NonNullable<Decision>; label: string; desc: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }[] = [
  { id: "approve", label: "Approve", desc: "Application meets all requirements", icon: CheckCircle, color: "#16a34a" },
  { id: "reject", label: "Reject", desc: "Application fails verification", icon: XCircle, color: "#dc2626" },
  { id: "text-recapture", label: "Text Recapture", desc: "Data fields need re-submission", icon: FileText, color: "#d97706" },
  { id: "image-recapture", label: "Image Recapture", desc: "Photo / biometrics need re-capture", icon: Camera, color: "#00A3D4" },
];

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: "#3D5872" }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EAF1F8" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

interface DetailPanelProps {
  app: Application;
  onDecisionSubmit: (id: string, decision: NonNullable<Decision>, notes: string) => void;
  onClose: () => void;
}

function DetailPanel({ app, onDecisionSubmit, onClose }: DetailPanelProps) {
  const [step, setStep] = useState<FlowStep>("overview");
  const [decision, setDecision] = useState<Decision>(null);
  const [notes, setNotes] = useState("");
  const risk = riskGradient(app.aiRisk);
  const stepIndex = FLOW_STEPS.findIndex((s) => s.id === step);

  const goNext = () => { const next = FLOW_STEPS[stepIndex + 1]; if (next) setStep(next.id); };
  const goBack = () => { const prev = FLOW_STEPS[stepIndex - 1]; if (prev) setStep(prev.id); };

  const canSubmit = decision !== null && (decision === "approve" || notes.trim().length > 0);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#FFFFFF", border: "1px solid #D6E2EE", minHeight: "580px" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: "#D6E2EE" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-mono mb-1" style={{ color: "#0068B7", fontFamily: "'DM Mono', monospace" }}>
              {app.id}
            </div>
            <h3 className="text-base font-bold" style={{ color: "#0D1B2A" }}>{app.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs" style={{ color: "#7A9AB8" }}>
                {app.channel} · {app.submitted}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}>
                {risk.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl"
              style={{ background: risk.bg, border: `1px solid ${risk.border}` }}
            >
              <span className="text-base font-bold leading-none" style={{ color: risk.color }}>{app.aiRisk}</span>
              <span style={{ color: risk.color, fontSize: "9px" }}>RISK</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors"
              style={{ color: "#7A9AB8", background: "#F3F7FB", border: "1px solid #D6E2EE" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1">
          {FLOW_STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = s.id === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? "rgba(0,104,183,0.08)" : done ? "rgba(22,163,74,0.06)" : "#F3F7FB",
                  color: active ? "#0068B7" : done ? "#16a34a" : "#7A9AB8",
                  border: `1px solid ${active ? "rgba(0,104,183,0.25)" : done ? "rgba(22,163,74,0.2)" : "#D6E2EE"}`,
                }}
              >
                {done ? (
                  <CheckCircle size={11} style={{ color: "#16a34a" }} />
                ) : (
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: active ? "#0068B7" : "#EAF1F8",
                      color: active ? "white" : "#7A9AB8",
                      fontSize: "9px",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── STEP 1: Overview ── */}
        {step === "overview" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#F8FAFC", border: "1px solid #D6E2EE" }}>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ background: "#0068B7", color: "white" }}
              >
                {app.firstName[0]}{app.lastName[0]}
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: "#0D1B2A" }}>{app.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>{app.gender} · DOB {app.dob}</div>
                <div className="text-xs mt-1 font-mono" style={{ color: "#0082D6", fontFamily: "'DM Mono', monospace" }}>
                  {app.idNumber}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: User, label: "First Name", value: app.firstName },
                { icon: User, label: "Last Name", value: app.lastName },
                { icon: Calendar, label: "Date of Birth", value: app.dob },
                { icon: Globe, label: "Nationality", value: app.nationality },
                { icon: Hash, label: "ID Number", value: app.idNumber, mono: true },
                { icon: User, label: "Gender", value: app.gender },
                { icon: MapPin, label: "Address", value: app.address },
                { icon: FileText, label: "Channel", value: app.channel },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="rounded-xl px-3 py-2.5" style={{ background: "#F8FAFC", border: "1px solid #D6E2EE" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={11} style={{ color: "#B3CAE0" }} />
                    <span className="text-xs" style={{ color: "#7A9AB8" }}>{label}</span>
                  </div>
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: "#0D1B2A", ...(mono ? { fontFamily: "'DM Mono', monospace", fontSize: "12px" } : {}) }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {app.aiFlags.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={14} style={{ color: "#dc2626" }} />
                  <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>AI Flags Detected</span>
                </div>
                <div className="space-y-1.5">
                  {app.aiFlags.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <TriangleAlert size={11} style={{ color: "#d97706" }} />
                      <span className="text-xs" style={{ color: "#d97706" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Documents ── */}
        {step === "documents" && (
          <div className="space-y-4">
            <p className="text-xs" style={{ color: "#7A9AB8" }}>Review uploaded documents and biometric photo.</p>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D6E2EE" }}>
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: "#D6E2EE", background: "#F8FAFC" }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: "#0082D6" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0D1B2A" }}>Application Form</span>
                </div>
                <button
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(0,104,183,0.08)", color: "#0068B7", border: "1px solid rgba(0,104,183,0.2)" }}
                >
                  <Eye size={11} /> View Full
                </button>
              </div>
              <div className="p-4" style={{ background: "#FFFFFF" }}>
                <div className="rounded-lg p-4" style={{ background: "#F3F7FB", border: "1px solid #D6E2EE" }}>
                  <div className="text-xs font-bold mb-3 tracking-wide" style={{ color: "#0D1B2A" }}>GHANA · IDENTITY DOCUMENT APPLICATION</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Surname", app.lastName],
                      ["First Name", app.firstName],
                      ["Date of Birth", app.dob],
                      ["Nationality", app.nationality],
                      ["Gender", app.gender],
                      ["Address", app.address],
                    ].map(([k, v]) => (
                      <div key={k} className="py-1 border-b" style={{ borderColor: "#D6E2EE" }}>
                        <div className="text-xs" style={{ color: "#B3CAE0", fontSize: "9px" }}>{k}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#0D1B2A" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D6E2EE" }}>
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: "#D6E2EE", background: "#F8FAFC" }}
              >
                <div className="flex items-center gap-2">
                  <Camera size={13} style={{ color: "#00BCD4" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0D1B2A" }}>Biometric Photo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {app.aiScores.biometricMatch >= 80 ? (
                    <ShieldCheck size={13} style={{ color: "#16a34a" }} />
                  ) : (
                    <ShieldAlert size={13} style={{ color: "#dc2626" }} />
                  )}
                  <span className="text-xs" style={{ color: app.aiScores.biometricMatch >= 80 ? "#16a34a" : "#dc2626" }}>
                    {app.aiScores.biometricMatch}% match
                  </span>
                </div>
              </div>
              <div className="p-4 flex gap-4" style={{ background: "#FFFFFF" }}>
                <div className="flex-1">
                  <p className="text-xs mb-2" style={{ color: "#7A9AB8" }}>Submitted</p>
                  <div className="rounded-xl flex flex-col items-center justify-center py-8" style={{ background: "#F3F7FB", border: "1px solid #D6E2EE" }}>
                    <div className="w-12 h-14 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,104,183,0.1)", border: "1px solid rgba(0,104,183,0.2)" }}>
                      <User size={24} style={{ color: "#0068B7" }} />
                    </div>
                    <span className="text-xs mt-2" style={{ color: "#B3CAE0" }}>{app.name}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-2" style={{ color: "#7A9AB8" }}>Reference (DB)</p>
                  <div className="rounded-xl flex flex-col items-center justify-center py-8" style={{ background: "#F3F7FB", border: "1px solid #D6E2EE" }}>
                    <div className="w-12 h-14 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,104,183,0.1)", border: "1px solid rgba(0,104,183,0.2)" }}>
                      <Fingerprint size={24} style={{ color: "#0068B7" }} />
                    </div>
                    <span className="text-xs mt-2" style={{ color: "#B3CAE0" }}>Reference</span>
                  </div>
                </div>
              </div>
            </div>

            {app.documentNotes && (
              <div className="rounded-xl p-4" style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.14)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <ScanLine size={13} style={{ color: "#0082D6" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0082D6" }}>AI Document Notes</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#3D5872" }}>{app.documentNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: AI Analysis ── */}
        {step === "ai-analysis" && (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: risk.color }} />
                  <span className="text-xs font-semibold" style={{ color: risk.color }}>Overall AI Risk Score</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: risk.color }}>{app.aiRisk}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "#EAF1F8" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${app.aiRisk}%`, background: risk.color }} />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ color: "#16a34a", fontSize: "9px" }}>Low</span>
                <span style={{ color: "#d97706", fontSize: "9px" }}>Medium</span>
                <span style={{ color: "#dc2626", fontSize: "9px" }}>High</span>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "#F8FAFC", border: "1px solid #D6E2EE" }}>
              <p className="text-xs font-semibold mb-4" style={{ color: "#3D5872" }}>Verification Score Breakdown</p>
              <div className="space-y-3">
                <ScoreBar label="Biometric Match" score={app.aiScores.biometricMatch} />
                <ScoreBar label="Document Authenticity" score={app.aiScores.documentAuthenticity} />
                <ScoreBar label="Data Consistency" score={app.aiScores.dataConsistency} />
                <ScoreBar label="Duplicate Check" score={app.aiScores.duplicateCheck} />
                <ScoreBar label="Signature Verification" score={app.aiScores.signatureVerification} />
                <ScoreBar label="Liveliness Check" score={app.aiScores.livelinessCheck} />
              </div>
            </div>

            {app.aiFlags.length > 0 ? (
              <div className="rounded-xl p-4" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.14)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} style={{ color: "#dc2626" }} />
                  <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>Active Flags</span>
                </div>
                <div className="space-y-2">
                  {app.aiFlags.map((flag) => (
                    <div
                      key={flag}
                      className="flex items-center gap-2 py-1.5 px-3 rounded-lg"
                      style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}
                    >
                      <AlertCircle size={11} style={{ color: "#dc2626" }} />
                      <span className="text-xs" style={{ color: "#dc2626" }}>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.15)" }}>
                <ShieldCheck size={18} style={{ color: "#16a34a" }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#16a34a" }}>No Flags Raised</p>
                  <p className="text-xs" style={{ color: "#7A9AB8" }}>All automated checks passed.</p>
                </div>
              </div>
            )}

            <div className="rounded-xl p-4" style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.15)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} style={{ color: "#0082D6" }} />
                <span className="text-xs font-semibold" style={{ color: "#0082D6" }}>AI Recommendation</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#0068B7" }}>{app.aiRecommendation}</p>
            </div>
          </div>
        )}

        {/* ── STEP 4: Decision ── */}
        {step === "decision" && (
          <div className="space-y-4">
            <p className="text-xs" style={{ color: "#7A9AB8" }}>
              Select a decision and provide supporting notes where required.
            </p>

            <div className="grid grid-cols-1 gap-2">
              {decisionOptions.map(({ id, label, desc, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setDecision(id)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: decision === id ? `${color}0A` : "#F8FAFC",
                    border: `1px solid ${decision === id ? color + "40" : "#D6E2EE"}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: decision === id ? `${color}18` : "#EAF1F8",
                      border: `1px solid ${decision === id ? color + "35" : "#D6E2EE"}`,
                    }}
                  >
                    <Icon size={16} style={{ color: decision === id ? color : "#7A9AB8" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: decision === id ? color : "#0D1B2A" }}>
                      {label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>{desc}</div>
                  </div>
                  {decision === id && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  )}
                </button>
              ))}
            </div>

            {decision && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#3D5872" }}>
                  {decision === "approve" ? "Additional Notes (optional)" : "Reason / Notes (required)"}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    decision === "approve"
                      ? "Any additional observations…"
                      : decision === "reject"
                      ? "State the reason for rejection…"
                      : decision === "text-recapture"
                      ? "Specify which text fields need correction…"
                      : "Describe the image quality issue…"
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #D6E2EE",
                    color: "#0D1B2A",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0068B7")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D6E2EE")}
                />
              </div>
            )}

            <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.12)" }}>
              <Sparkles size={12} style={{ color: "#0082D6", flexShrink: 0, marginTop: "1px" }} />
              <p className="text-xs" style={{ color: "#3D5872" }}>
                <span style={{ color: "#0068B7", fontWeight: 600 }}>AI: </span>
                {app.aiRecommendation}
              </p>
            </div>

            <button
              onClick={() => decision && onDecisionSubmit(app.id, decision, notes)}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: !canSubmit
                  ? "#EAF1F8"
                  : decision === "approve"
                  ? "linear-gradient(135deg, #22c55e, #15803d)"
                  : decision === "reject"
                  ? "linear-gradient(135deg, #ef4444, #b91c1c)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                color: !canSubmit ? "#B3CAE0" : "white",
                opacity: !canSubmit ? 0.7 : 1,
                cursor: !canSubmit ? "not-allowed" : "pointer",
              }}
            >
              <CheckCircle size={14} />
              Submit Decision
            </button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="px-5 py-3 border-t flex items-center justify-between flex-shrink-0" style={{ borderColor: "#D6E2EE", background: "#F8FAFC" }}>
        <button
          onClick={goBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
          style={{
            color: stepIndex === 0 ? "#D6E2EE" : "#3D5872",
            background: stepIndex === 0 ? "transparent" : "#FFFFFF",
            border: `1px solid ${stepIndex === 0 ? "transparent" : "#D6E2EE"}`,
            cursor: stepIndex === 0 ? "default" : "pointer",
          }}
        >
          <ChevronLeft size={14} />
          Back
        </button>

        <div className="flex gap-1">
          {FLOW_STEPS.map((s, i) => (
            <div
              key={s.id}
              className="w-6 h-1 rounded-full transition-all"
              style={{ background: i === stepIndex ? "#0068B7" : i < stepIndex ? "#16a34a" : "#D6E2EE" }}
            />
          ))}
        </div>

        {stepIndex < FLOW_STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all btn-primary"
            style={{ color: "white" }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        ) : (
          <div style={{ width: "72px" }} />
        )}
      </div>
    </div>
  );
}

export default function AdjudicationModule() {
  const [selected, setSelected] = useState<string | null>(null);
  const [processed, setProcessed] = useState<Record<string, { decision: NonNullable<Decision>; notes: string }>>({});

  const pending = applications.filter((a) => !processed[a.id]);
  const done = applications.filter((a) => processed[a.id]);
  const selectedApp = applications.find((a) => a.id === selected);

  const handleDecisionSubmit = (id: string, decision: NonNullable<Decision>, notes: string) => {
    setProcessed((p) => ({ ...p, [id]: { decision, notes } }));
    setSelected(null);
  };

  const handleSelect = (id: string) => { setSelected((prev) => (prev === id ? null : id)); };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Adjudication</h2>
          <p className="text-xs" style={{ color: "#7A9AB8" }}>
            Review applications · AI-assisted risk scoring active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="ai-badge px-3 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles size={12} style={{ color: "#0082D6" }} />
            <span className="text-xs" style={{ color: "#0082D6" }}>AI Risk Engine Active</span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs"
            style={{ background: "rgba(0,104,183,0.08)", border: "1px solid rgba(0,104,183,0.22)", color: "#0068B7" }}
          >
            {pending.length} pending
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending Review", value: pending.length.toString(), color: "#0068B7", icon: Clock },
          { label: "High Risk", value: pending.filter((a) => a.aiRisk >= 60).length.toString(), color: "#dc2626", icon: AlertTriangle },
          { label: "Approved Today", value: (23 + Object.values(processed).filter((p) => p.decision === "approve").length).toString(), color: "#16a34a", icon: CheckCircle },
          { label: "AI Accuracy", value: "94.7%", color: "#0082D6", icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}28` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color }}>{value}</div>
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
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9AB8" }}>
                Queue · {pending.length} Applications
              </span>
            </div>

            <div>
              {pending.length === 0 && done.length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle size={28} style={{ color: "#16a34a", margin: "0 auto 8px" }} />
                  <p className="text-sm" style={{ color: "#0D1B2A" }}>All cleared!</p>
                </div>
              )}

              {pending.map((app) => {
                const risk = riskGradient(app.aiRisk);
                const isSelected = selected === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(app.id)}
                    className="w-full px-4 py-3.5 text-left border-b transition-all"
                    style={{
                      borderBottomColor: "#F3F7FB",
                      background: isSelected ? "rgba(0,104,183,0.06)" : "#FFFFFF",
                      borderLeftWidth: "2px",
                      borderLeftStyle: "solid",
                      borderLeftColor: isSelected ? "#0068B7" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="text-xs font-mono mb-0.5" style={{ color: "#0068B7", fontSize: "10px", fontFamily: "'DM Mono', monospace" }}>
                          {app.id}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>{app.name}</div>
                      </div>
                      <div
                        className="text-xs px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-2"
                        style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}
                      >
                        {app.aiRisk}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#7A9AB8" }}>{app.channel} · {app.submitted}</span>
                      {app.aiFlags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle size={11} style={{ color: risk.color }} />
                          <span className="text-xs" style={{ color: "#7A9AB8", fontSize: "10px" }}>
                            {app.aiFlags.length} flag{app.aiFlags.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    {app.aiFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {app.aiFlags.map((f) => (
                          <span key={f} className="px-1.5 py-0.5 rounded" style={{ background: "rgba(220,38,38,0.07)", color: "#dc2626", fontSize: "9px" }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {done.length > 0 && (
              <>
                <div className="px-4 py-2 border-t border-b" style={{ borderColor: "#D6E2EE", background: "#F8FAFC" }}>
                  <span style={{ color: "#B3CAE0", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Processed · {done.length}
                  </span>
                </div>
                {done.map((app) => {
                  const outcome = processed[app.id];
                  const decisionColor = outcome.decision === "approve" ? "#16a34a" : outcome.decision === "reject" ? "#dc2626" : "#d97706";
                  return (
                    <div key={app.id} className="px-4 py-3 border-b flex items-center gap-3 opacity-60" style={{ borderColor: "#F3F7FB" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: decisionColor }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate" style={{ color: "#0D1B2A" }}>{app.name}</div>
                        <div className="text-xs capitalize" style={{ color: decisionColor }}>{outcome.decision.replace("-", " ")}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selectedApp ? (
            <DetailPanel key={selectedApp.id} app={selectedApp} onDecisionSubmit={handleDecisionSubmit} onClose={() => setSelected(null)} />
          ) : (
            <div className="rounded-2xl flex flex-col items-center justify-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #D6E2EE", minHeight: "580px" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,104,183,0.06)", border: "1px solid rgba(0,104,183,0.12)" }}>
                <Scale size={26} style={{ color: "#B3CAE0" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "#3D5872" }}>Select an application</p>
                <p className="text-xs mt-1" style={{ color: "#B3CAE0" }}>Click a queue item to open the adjudication flow</p>
              </div>
              {pending.length > 0 && (
                <button
                  onClick={() => setSelected(pending[0].id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium mt-2 transition-all"
                  style={{ background: "rgba(0,104,183,0.07)", border: "1px solid rgba(0,104,183,0.2)", color: "#0068B7" }}
                >
                  Start with next in queue
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
