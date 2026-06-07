import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Alert } from "../components/UI";

const DEMO = [
  { label: "Admin", email: "admin@library.com", icon: "🛡️", color: "#f43f5e" },
  { label: "Librarian", email: "librarian@library.com", icon: "📋", color: "#a855f7" },
  { label: "Member", email: "john@example.com", icon: "👤", color: "#14b8a6" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@library.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Is the backend running on port 5001?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--font-body)",
    }}>
      {/* ── Left Panel — Background Image ── */}
      <div style={{
        flex: 1,
        background: `linear-gradient(135deg, #0f1117 0%, #1a1f35 50%, #0d1b2a 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated circles background */}
        {[
          { w: 400, h: 400, top: "-100px", left: "-100px", color: "#3b82f620" },
          { w: 300, h: 300, top: "50%", left: "60%", color: "#a855f715" },
          { w: 200, h: 200, top: "70%", left: "10%", color: "#14b8a620" },
          { w: 150, h: 150, top: "20%", left: "70%", color: "#f43f5e15" },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.w, height: c.h,
            borderRadius: "50%", background: c.color,
            top: c.top, left: c.left,
            filter: "blur(40px)",
          }} />
        ))}

        {/* Floating book cards */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420 }}>
          {/* Big icon */}
          <div style={{
            fontSize: 80, marginBottom: 24,
            filter: "drop-shadow(0 0 30px #3b82f660)",
          }}>📚</div>

          <h1 style={{
            fontSize: 36, fontWeight: 800, color: "#e2e8f0",
            fontFamily: "var(--font-head)", letterSpacing: -1,
            marginBottom: 16, lineHeight: 1.2,
          }}>
            Your Library,<br />
            <span style={{ color: "#3b82f6" }}>Digitized.</span>
          </h1>

          <p style={{ color: "#7d8fa8", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Manage books, track borrows, handle members — all in one beautiful portal.
          </p>

          {/* Feature pills */}
          {[
            { icon: "📖", text: "10,000+ Books Managed" },
            { icon: "👥", text: "Role-Based Access Control" },
            { icon: "⚡", text: "Real-Time Availability" },
            { icon: "💰", text: "Auto Fine Calculation" },
          ].map(f => (
            <div key={f.text} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#ffffff08", border: "1px solid #ffffff12",
              borderRadius: 10, padding: "10px 16px", marginBottom: 10,
              textAlign: "left",
            }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div style={{
        width: 440,
        background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800') center/cover no-repeat`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 36px",
        borderLeft: "1px solid #1e2a3d",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
          <div style={{
            width: 52, height: 52, background: "#3b82f618",
            border: "1px solid #3b82f640", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 14px",
          }}>📖</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", fontFamily: "var(--font-head)", letterSpacing: -.3 }}>
            Welcome Back
          </h2>
          <p style={{ color: "#7d8fa8", fontSize: 13, marginTop: 4 }}>Sign in to your account</p>
        </div>

        {/* Demo tiles */}
        <p style={{ fontSize: 10, color: "#3d4f63", textAlign: "center", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, width: "100%" }}>
          Quick Demo Access
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, width: "100%" }}>
          {DEMO.map(d => (
            <button key={d.email} onClick={() => setEmail(d.email)} style={{
              flex: 1,
              background: email === d.email ? d.color + "20" : "#0f1520",
              border: `1px solid ${email === d.email ? d.color : "#1e2a3d"}`,
              borderRadius: 9, padding: "9px 6px", cursor: "pointer",
              color: email === d.email ? d.color : "#7d8fa8",
              fontSize: 11, fontWeight: 600, transition: "all .15s", textAlign: "center",
            }}>
              <div style={{ fontSize: 16, marginBottom: 3 }}>{d.icon}</div>
              {d.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Alert message={error} />

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%" }} placeholder="email@example.com" required />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: "100%" }} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px",
            background: loading ? "#1e3a5f" : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#fff", border: "none", borderRadius: 9,
            fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            transition: "all .2s", letterSpacing: .3,
            boxShadow: loading ? "none" : "0 4px 20px #3b82f640",
          }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          margin: "22px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "#1e2a3d" }} />
          <span style={{ fontSize: 11, color: "#3d4f63" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#1e2a3d" }} />
        </div>

        {/* Register link */}
        <Link to="/register" style={{
          width: "100%", display: "block", textAlign: "center",
          padding: "11px", border: "1px solid #1e2a3d",
          borderRadius: 9, color: "#7d8fa8", fontSize: 13,
          fontWeight: 600, textDecoration: "none",
          transition: "all .15s", background: "#0f1520",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.color = "#3b82f6"; }}
          onMouseLeave={e => { e.target.style.borderColor = "#1e2a3d"; e.target.style.color = "#7d8fa8"; }}
        >
          New user? Create an account →
        </Link>

        <p style={{ textAlign: "center", fontSize: 11, color: "#3d4f63", marginTop: 20 }}>
          Demo password: <strong style={{ color: "#7d8fa8" }}>password</strong>
        </p>
      </div>
    </div >
  );
}
