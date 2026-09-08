import { useState } from "react";
import {
  FileText,
  User,
  Upload,
  Scan,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Camera,
  MapPin,
  Hash,
  Calendar,
  Globe,
  X,
} from "lucide-react";

type Channel = "paper" | "in-person" | null;
type Step = "channel" | "capture" | "review" | "submit" | "success";

const aiExtracted = {
  firstName: "Margaret",
  lastName: "Osei-Bonsu",
  dob: "1989-03-14",
  nationality: "GHA",
  idNumber: "GHA-2024-004891",
  address: "14 Cantonments Road, Accra",
  gender: "Female",
  expiryDate: "2034-03-13",
};

const recentApplications = [
  { id: "APP-00000004", name: "James Adarkwa", channel: "Paper", status: "Submitted", time: "09:14", risk: "Low" },
  { id: "APP-00000003", name: "Ama Serwaa", channel: "In-Person", status: "Submitted", time: "08:52", risk: "Medium" },
  { id: "APP-00000002", name: "Kofi Mensa", channel: "Paper", status: "Submitted", time: "08:30", risk: "Low" },
  { id: "APP-00000001", name: "Abena Owusu", channel: "In-Person", status: "Adjudication", time: "Yesterday", risk: "High" },
];

const riskColor: Record<string, string> = {
  Low: "#16a34a",
  Medium: "#d97706",
  High: "#dc2626",
};

export default function EnrolmentModule() {
  const [channel, setChannel] = useState<Channel>(null);
  const [step, setStep] = useState<Step>("channel");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [form, setForm] = useState({ ...aiExtracted });
  const [showNewApp, setShowNewApp] = useState(false);

  const handleChannelSelect = (c: Channel) => {
    setChannel(c);
    setStep("capture");
    setAiDone(false);
  };

  const handleAIScan = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiDone(true);
      setStep("review");
    }, 2000);
  };

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      setStep("channel");
      setChannel(null);
      setAiDone(false);
      setShowNewApp(false);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#0D1B2A" }}>Enrolment</h2>
          <p className="text-xs" style={{ color: "#7A9AB8" }}>
            Submit new identity document applications
          </p>
        </div>
        <button
          onClick={() => { setShowNewApp(true); setStep("channel"); setChannel(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-primary"
        >
          <FileText size={14} />
          New Application
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Application Flow */}
        {showNewApp ? (
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 relative"
              style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
            >
              <button
                onClick={() => setShowNewApp(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg"
                style={{ color: "#7A9AB8", background: "#F3F7FB" }}
              >
                <X size={14} />
              </button>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                {(["channel", "capture", "review", "submit"] as Step[]).map((s, i, arr) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background:
                          step === s
                            ? "#0068B7"
                            : arr.indexOf(step) > i
                            ? "rgba(22,163,74,0.15)"
                            : "#EAF1F8",
                        color:
                          step === s ? "white" : arr.indexOf(step) > i ? "#16a34a" : "#7A9AB8",
                        border: step === s ? "none" : arr.indexOf(step) > i ? "1px solid rgba(22,163,74,0.3)" : "1px solid #D6E2EE",
                      }}
                    >
                      {arr.indexOf(step) > i ? "✓" : i + 1}
                    </div>
                    <span className="text-xs capitalize" style={{ color: step === s ? "#0068B7" : "#7A9AB8" }}>
                      {s}
                    </span>
                    {i < arr.length - 1 && (
                      <div className="h-px flex-1 mx-1" style={{ width: "24px", background: "#D6E2EE" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step: Channel */}
              {step === "channel" && (
                <div>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "#0D1B2A" }}>Select Application Channel</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleChannelSelect("paper")}
                      className="p-5 rounded-xl text-left card-hover"
                      style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.18)" }}
                    >
                      <FileText size={24} style={{ color: "#0068B7" }} />
                      <div className="mt-3 font-semibold text-sm" style={{ color: "#0D1B2A" }}>Paper Channel</div>
                      <div className="text-xs mt-1" style={{ color: "#7A9AB8" }}>
                        Scan and digitise physical application form
                      </div>
                      <div className="mt-3 text-xs flex items-center gap-1" style={{ color: "#0068B7" }}>
                        <Sparkles size={11} /> AI auto-extraction enabled
                      </div>
                    </button>

                    <button
                      onClick={() => handleChannelSelect("in-person")}
                      className="p-5 rounded-xl text-left card-hover"
                      style={{ background: "rgba(0,163,212,0.04)", border: "1px solid rgba(0,163,212,0.18)" }}
                    >
                      <User size={24} style={{ color: "#00A3D4" }} />
                      <div className="mt-3 font-semibold text-sm" style={{ color: "#0D1B2A" }}>In-Person Channel</div>
                      <div className="text-xs mt-1" style={{ color: "#7A9AB8" }}>
                        Capture applicant details in real-time
                      </div>
                      <div className="mt-3 text-xs flex items-center gap-1" style={{ color: "#00A3D4" }}>
                        <Camera size={11} /> Biometric capture available
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Capture */}
              {step === "capture" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: channel === "paper" ? "rgba(0,104,183,0.08)" : "rgba(0,163,212,0.08)",
                        color: channel === "paper" ? "#0068B7" : "#00A3D4",
                        border: `1px solid ${channel === "paper" ? "rgba(0,104,183,0.22)" : "rgba(0,163,212,0.22)"}`,
                      }}
                    >
                      {channel === "paper" ? "Paper Channel" : "In-Person Channel"}
                    </span>
                  </div>

                  {channel === "paper" ? (
                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: "#0D1B2A" }}>Scan Application Document</h3>
                      <div
                        className="relative rounded-xl flex flex-col items-center justify-center py-14 mb-4"
                        style={{ background: "#F8FAFC", border: "2px dashed #D6E2EE" }}
                      >
                        <Scan size={32} style={{ color: "#B3CAE0" }} />
                        <p className="text-sm mt-2" style={{ color: "#7A9AB8" }}>
                          Drop scanned document or click to upload
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#B3CAE0" }}>
                          PDF, JPG, PNG · Max 25MB
                        </p>
                        <button
                          className="mt-4 px-4 py-2 rounded-lg text-xs font-medium"
                          style={{
                            background: "#EAF1F8",
                            border: "1px solid #D6E2EE",
                            color: "#3D5872",
                          }}
                        >
                          <Upload size={12} className="inline mr-1.5" />
                          Browse Files
                        </button>
                      </div>

                      <div
                        className="rounded-xl p-4 mb-4"
                        style={{ background: "rgba(0,104,183,0.04)", border: "1px solid rgba(0,104,183,0.14)" }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles size={13} style={{ color: "#0082D6" }} />
                          <span className="text-xs font-semibold" style={{ color: "#0082D6" }}>AI Document Intelligence</span>
                        </div>
                        <p className="text-xs" style={{ color: "#3D5872" }}>
                          Our AI will automatically extract all fields (name, DOB, ID number, address) from the scanned document with 98.4% accuracy. Review before submission.
                        </p>
                      </div>

                      <button
                        onClick={handleAIScan}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white btn-primary flex items-center justify-center gap-2"
                      >
                        {aiLoading ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            AI Extracting Data…
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            Run AI Extraction
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: "#0D1B2A" }}>Capture Applicant Information</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { label: "First Name", icon: User, value: aiExtracted.firstName },
                          { label: "Last Name", icon: User, value: aiExtracted.lastName },
                          { label: "Date of Birth", icon: Calendar, value: aiExtracted.dob },
                          { label: "Nationality", icon: Globe, value: aiExtracted.nationality },
                          { label: "ID Number", icon: Hash, value: aiExtracted.idNumber },
                          { label: "Address", icon: MapPin, value: aiExtracted.address },
                        ].map(({ label, icon: Icon, value }) => (
                          <div key={label}>
                            <label className="block text-xs mb-1" style={{ color: "#7A9AB8" }}>{label}</label>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F3F7FB", border: "1px solid #D6E2EE" }}>
                              <Icon size={12} style={{ color: "#B3CAE0" }} />
                              <input
                                className="flex-1 bg-transparent text-sm outline-none"
                                style={{ color: "#0D1B2A" }}
                                defaultValue={value}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep("review")}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white btn-primary flex items-center justify-center gap-2"
                      >
                        Continue to Review
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step: Review */}
              {step === "review" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold" style={{ color: "#0D1B2A" }}>Review Extracted Data</h3>
                    {aiDone && (
                      <div className="flex items-center gap-1.5 ai-badge px-2.5 py-1 rounded-full text-xs" style={{ color: "#0082D6" }}>
                        <Sparkles size={11} />
                        AI Extracted · 98.4% confidence
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(form).map(([key, val]) => (
                      <div key={key}>
                        <label className="block text-xs mb-1 capitalize" style={{ color: "#7A9AB8" }}>
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <input
                          value={val}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            background: "rgba(0,104,183,0.04)",
                            border: "1px solid rgba(0,104,183,0.18)",
                            color: "#0D1B2A",
                            fontFamily: key === "idNumber" ? "'DM Mono', monospace" : undefined,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Biometric capture */}
                  <div
                    className="rounded-xl p-4 mb-4 flex items-center gap-4"
                    style={{ background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.15)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(22,163,74,0.08)", border: "1px dashed rgba(22,163,74,0.3)" }}
                    >
                      <Camera size={20} style={{ color: "#16a34a" }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: "#0D1B2A" }}>Biometric Photo</p>
                      <p className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>
                        Capture or upload applicant photograph
                      </p>
                    </div>
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(22,163,74,0.08)",
                        border: "1px solid rgba(22,163,74,0.22)",
                        color: "#16a34a",
                      }}
                    >
                      Capture
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("capture")}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: "#F3F7FB", border: "1px solid #D6E2EE", color: "#3D5872" }}
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep("submit")}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary"
                    >
                      Confirm & Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Submit */}
              {step === "submit" && (
                <div>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "#0D1B2A" }}>Final Review & Submission</h3>

                  <div className="rounded-xl p-4 mb-4" style={{ background: "#F8FAFC", border: "1px solid #D6E2EE" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium" style={{ color: "#3D5872" }}>Application Summary</span>
                      <span className="text-xs font-mono" style={{ color: "#0068B7" }}>APP-00000005</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        ["Applicant", `${form.firstName} ${form.lastName}`],
                        ["DOB", form.dob],
                        ["ID Number", form.idNumber],
                        ["Nationality", form.nationality],
                        ["Channel", channel === "paper" ? "Paper" : "In-Person"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-xs" style={{ color: "#7A9AB8" }}>{k}</span>
                          <span
                            className="text-xs font-medium"
                            style={{
                              color: "#0D1B2A",
                              fontFamily: k === "ID Number" ? "'DM Mono', monospace" : undefined,
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Risk Pre-Screen */}
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: "rgba(22,163,74,0.04)", border: "1px solid rgba(22,163,74,0.15)" }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={12} style={{ color: "#16a34a" }} />
                      <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>AI Pre-Screen Result</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-xs mb-1" style={{ color: "#7A9AB8" }}>Risk Assessment</div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full flex-1" style={{ background: "#EAF1F8" }}>
                            <div className="h-full rounded-full" style={{ width: "18%", background: "#16a34a" }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: "#16a34a" }}>LOW · 18%</span>
                        </div>
                      </div>
                      <CheckCircle size={20} style={{ color: "#16a34a" }} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("review")}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: "#F3F7FB", border: "1px solid #D6E2EE", color: "#3D5872" }}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary"
                    >
                      Submit to Adjudication
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Success */}
              {step === "success" && (
                <div className="text-center py-8">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 status-glow-green"
                    style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.35)" }}
                  >
                    <CheckCircle size={28} style={{ color: "#16a34a" }} />
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ color: "#0D1B2A" }}>Application Submitted</h3>
                  <p className="text-xs" style={{ color: "#7A9AB8" }}>
                    APP-00000005 is now in the Adjudication queue.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#B3CAE0" }}>
                    Returning to channel selection…
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2">
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => { setShowNewApp(true); handleChannelSelect("paper"); }}
                className="p-5 rounded-xl text-left card-hover"
                style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
              >
                <FileText size={22} style={{ color: "#0068B7" }} />
                <div className="mt-3 text-sm font-semibold" style={{ color: "#0D1B2A" }}>Paper Application</div>
                <div className="text-xs mt-1" style={{ color: "#7A9AB8" }}>Scan & AI-extract document</div>
              </button>
              <button
                onClick={() => { setShowNewApp(true); handleChannelSelect("in-person"); }}
                className="p-5 rounded-xl text-left card-hover"
                style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
              >
                <User size={22} style={{ color: "#00A3D4" }} />
                <div className="mt-3 text-sm font-semibold" style={{ color: "#0D1B2A" }}>In-Person Application</div>
                <div className="text-xs mt-1" style={{ color: "#7A9AB8" }}>Real-time data capture</div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Today's Submissions", value: "14", delta: "+3 vs yesterday", color: "#0068B7" },
                { label: "AI Extraction Rate", value: "98.4%", delta: "Accuracy", color: "#0082D6" },
                { label: "Avg. Processing", value: "4.2 min", delta: "Paper channel", color: "#16a34a" },
              ].map(({ label, value, delta, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
                >
                  <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: "#0D1B2A" }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7A9AB8" }}>{delta}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications Sidebar */}
        <div>
          <div
            className="rounded-2xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid #D6E2EE" }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7A9AB8" }}>
              Recent Applications
            </h3>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl card-hover cursor-pointer"
                  style={{ background: "#F8FAFC", border: "1px solid #D6E2EE" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: "#0068B7", fontSize: "10px" }}>
                      {app.id}
                    </span>
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: riskColor[app.risk] }}
                      title={`${app.risk} risk`}
                    />
                  </div>
                  <div className="text-sm font-medium" style={{ color: "#0D1B2A" }}>{app.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: "#7A9AB8" }}>{app.channel}</span>
                    <span className="text-xs" style={{ color: "#B3CAE0" }}>{app.time}</span>
                  </div>
                  <div className="mt-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: app.status === "Submitted" ? "rgba(0,104,183,0.08)" : "rgba(217,119,6,0.08)",
                        color: app.status === "Submitted" ? "#0068B7" : "#d97706",
                        border: `1px solid ${app.status === "Submitted" ? "rgba(0,104,183,0.2)" : "rgba(217,119,6,0.2)"}`,
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
