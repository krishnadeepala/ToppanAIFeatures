import { useState } from "react";
import { Shield, ChevronRight, Eye, EyeOff } from "lucide-react";
import type { Role } from "./shared/AppShell";

const roles: { id: Role; label: string; description: string }[] = [
  { id: "enrolment",   label: "Enrolment Officer", description: "Submit applications via Paper & In-Person channels" },
  { id: "adjudicator", label: "Adjudicator",        description: "Review and adjudicate submitted applications" },
  { id: "perso",       label: "Perso Operator",     description: "Manage personalisation and document printing" },
  { id: "qa",          label: "QA Officer",         description: "Quality assurance, verification and re-perso" },
  { id: "admin",       label: "System Admin",       description: "Full access across all IDS modules" },
];

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<"role" | "creds">("role");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selectedRole || !username || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedRole); }, 1200);
  };

  const selectedRoleInfo = roles.find((r) => r.id === selectedRole);

  return (
    <div className="h-full flex overflow-hidden" style={{ background: "#F3F7FB" }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between flex-shrink-0"
        style={{
          width: "420px",
          borderRight: "1px solid #D6E2EE",
          background: "#FFFFFF",
          padding: "48px",
        }}
      >
        {/* Wordmark */}
        <div>
          <div className="flex items-center gap-3 mb-14">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: "40px", height: "40px", background: "#0068B7" }}
            >
              <span style={{ color: "white", fontWeight: 800, fontSize: "18px" }}>T</span>
            </div>
            <div>
              <div className="toppan-wordmark" style={{ fontSize: "18px" }}>TOPP<span>AN</span></div>
              <div style={{ color: "#7A9AB8", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Security
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#0D1B2A", lineHeight: 1.2, marginBottom: "16px" }}>
            Identity Document<br />
            <span className="gradient-text">System</span>
          </h2>

          <p style={{ fontSize: "13px", color: "#3D5872", lineHeight: 1.7, maxWidth: "300px" }}>
            Secure, end-to-end identity document management. Built on TOPPAN's proven expertise in government identity solutions.
          </p>

          {/* Flow steps */}
          <div style={{ marginTop: "40px" }}>
            {[
              ["Enrolment",       "Paper & In-Person application intake"],
              ["Adjudication",    "AI-assisted risk review and decision"],
              ["Personalisation", "Secure document printing and encoding"],
              ["Quality Assurance","Visual & chip verification checks"],
              ["Verification",    "Re-perso and dispatch confirmation"],
            ].map(([label, desc], i) => (
              <div key={label} className="flex items-start gap-3" style={{ marginBottom: "16px" }}>
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: "22px", height: "22px",
                    background: "rgba(0,104,183,0.1)",
                    border: "1px solid rgba(0,104,183,0.25)",
                    color: "#0068B7",
                    fontSize: "10px",
                    fontWeight: 700,
                    marginTop: "1px",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#0D1B2A" }}>{label}</div>
                  <div style={{ fontSize: "11px", color: "#7A9AB8", marginTop: "1px" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(0,104,183,0.05)", border: "1px solid rgba(0,104,183,0.15)" }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#0068B7", marginBottom: "4px", letterSpacing: "0.04em" }}>
            TOPPAN Security
          </div>
          <p style={{ fontSize: "12px", color: "#3D5872", lineHeight: 1.6 }}>
            Trust at Every Touchpoint.<br />Across Identity &amp; Payment.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile wordmark */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: "32px", height: "32px", background: "#0068B7" }}
            >
              <span style={{ color: "white", fontWeight: 800, fontSize: "14px" }}>T</span>
            </div>
            <div className="toppan-wordmark" style={{ fontSize: "15px" }}>TOPP<span>AN</span></div>
          </div>

          {step === "role" ? (
            <>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0D1B2A", marginBottom: "4px" }}>
                Select your role
              </h1>
              <p style={{ fontSize: "13px", color: "#3D5872", marginBottom: "24px" }}>
                Access is scoped to your assigned role and responsibilities.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className="w-full flex items-center gap-3 text-left rounded-xl transition-all duration-150"
                    style={{
                      padding: "14px 16px",
                      background: selectedRole === r.id ? "rgba(0,104,183,0.07)" : "#FFFFFF",
                      border: `1px solid ${selectedRole === r.id ? "rgba(0,104,183,0.4)" : "#D6E2EE"}`,
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: "34px", height: "34px",
                        background: selectedRole === r.id ? "#0068B7" : "rgba(0,104,183,0.07)",
                        border: `1px solid ${selectedRole === r.id ? "#0068B7" : "#D6E2EE"}`,
                        color: selectedRole === r.id ? "white" : "#7A9AB8",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      {r.label[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: selectedRole === r.id ? "#0068B7" : "#0D1B2A" }}>
                        {r.label}
                      </div>
                      <div className="text-xs truncate" style={{ color: "#7A9AB8" }}>
                        {r.description}
                      </div>
                    </div>
                    {selectedRole === r.id && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#0068B7" }} />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => selectedRole && setStep("creds")}
                disabled={!selectedRole}
                className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white btn-primary transition-all"
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  opacity: selectedRole ? 1 : 0.35,
                  cursor: selectedRole ? "pointer" : "not-allowed",
                }}
              >
                Continue
                <ChevronRight size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-1 text-xs mb-6 transition-colors"
                style={{ color: "#7A9AB8" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#3D5872")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#7A9AB8")}
              >
                ← Back to role selection
              </button>

              {selectedRoleInfo && (
                <div
                  className="flex items-center gap-3 rounded-xl mb-6"
                  style={{
                    padding: "12px 16px",
                    background: "rgba(0,104,183,0.06)",
                    border: "1px solid rgba(0,104,183,0.2)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: "34px", height: "34px", background: "#0068B7", color: "white", fontWeight: 700, fontSize: "13px" }}
                  >
                    {selectedRoleInfo.label[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#0068B7" }}>{selectedRoleInfo.label}</div>
                    <div className="text-xs" style={{ color: "#7A9AB8" }}>{selectedRoleInfo.description}</div>
                  </div>
                </div>
              )}

              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0D1B2A", marginBottom: "4px" }}>Sign in</h1>
              <p style={{ fontSize: "13px", color: "#3D5872", marginBottom: "24px" }}>
                Enter your TOPPAN IDS credentials to continue.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#3D5872" }}>
                    Employee ID / Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. EMP-00124"
                    className="w-full rounded-xl text-sm outline-none transition-all"
                    style={{
                      padding: "11px 16px",
                      background: "#FFFFFF",
                      border: "1px solid #D6E2EE",
                      color: "#0D1B2A",
                      fontFamily: "'DM Mono', monospace",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#0068B7")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#D6E2EE")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#3D5872" }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl text-sm outline-none transition-all"
                      style={{
                        padding: "11px 44px 11px 16px",
                        background: "#FFFFFF",
                        border: "1px solid #D6E2EE",
                        color: "#0D1B2A",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#0068B7")}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = "#D6E2EE")}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#7A9AB8" }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!username || !password || loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white btn-primary transition-all"
                  style={{
                    padding: "12px",
                    opacity: !username || !password ? 0.4 : 1,
                    cursor: !username || !password ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <Shield size={14} />
                      Sign In Securely
                    </>
                  )}
                </button>
              </div>

              <p className="text-center mt-5" style={{ fontSize: "11px", color: "#B3CAE0" }}>
                Access is logged and monitored &nbsp;·&nbsp; TOPPAN IDS v2.1.4
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
