// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Alert } from "../components/UI";

// const DEMO = [
//   { label: "Admin", email: "admin@library.com", icon: "🛡️", color: "var(--rose)" },
//   { label: "Librarian", email: "librarian@library.com", icon: "📋", color: "var(--purple)" },
//   { label: "Member", email: "john@example.com", icon: "👤", color: "var(--teal)" },
// ];

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("admin@library.com");
//   const [password, setPassword] = useState("password");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(""); setLoading(true);
//     try {
//       await login(email, password);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Is the backend running?");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "20px",
//     }} className="fade-in">
      
//       {/* ── Main Glassmorphism Container ── */}
//       <div style={{
//         display: "flex",
//         width: "100%",
//         maxWidth: 1000,
//         minHeight: 600,
//         background: "var(--surface)",
//         backdropFilter: "blur(24px)",
//         WebkitBackdropFilter: "blur(24px)",
//         border: "1px solid var(--border)",
//         borderRadius: 24,
//         boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
//         overflow: "hidden",
//       }}>
        
//         {/* ── Left Panel — Features & Branding ── */}
//         <div style={{
//           flex: 1,
//           background: "rgba(255, 255, 255, 0.4)", // Extra light overlay
//           borderRight: "1px solid var(--border)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 48,
//           position: "relative",
//         }}>
//           <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 360 }}>
//             {/* Big icon */}
//             <div style={{
//               fontSize: 72, marginBottom: 24,
//               filter: "drop-shadow(0 10px 15px rgba(217, 119, 6, 0.2))",
//             }}>📚</div>

//             <h1 style={{
//               fontSize: 36, fontWeight: 800, color: "var(--text1)",
//               letterSpacing: -1, marginBottom: 16, lineHeight: 1.2,
//             }}>
//               Your Library,<br />
//               <span style={{ color: "var(--accent)" }}>Digitized.</span>
//             </h1>

//             <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
//               Manage books, track borrows, handle members — all in one beautiful portal.
//             </p>

//             {/* Feature pills */}
//             {[
//               { icon: "📖", text: "10,000+ Books Managed" },
//               { icon: "👥", text: "Role-Based Access Control" },
//               { icon: "⚡", text: "Real-Time Availability" },
//               { icon: "💰", text: "Auto Fine Calculation" },
//             ].map(f => (
//               <div key={f.text} style={{
//                 display: "flex", alignItems: "center", gap: 12,
//                 background: "rgba(255, 255, 255, 0.6)", 
//                 border: "1px solid var(--border)",
//                 borderRadius: 12, padding: "12px 16px", marginBottom: 12,
//                 textAlign: "left", boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
//               }}>
//                 <span style={{ fontSize: 18 }}>{f.icon}</span>
//                 <span style={{ color: "var(--text1)", fontSize: 14, fontWeight: 500 }}>{f.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── Right Panel — Login Form ── */}
//         <div style={{
//           width: 440,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "40px 48px",
//         }}>
//           {/* Header */}
//           <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
//             <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text1)", letterSpacing: -.3 }}>
//               Welcome Back
//             </h2>
//             <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
//           </div>

//           {/* Demo tiles */}
//           <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1, width: "100%", fontWeight: 600 }}>
//             Quick Demo Access
//           </p>
//           <div style={{ display: "flex", gap: 8, marginBottom: 24, width: "100%" }}>
//             {DEMO.map(d => (
//               <button key={d.email} onClick={() => setEmail(d.email)} style={{
//                 flex: 1,
//                 background: email === d.email ? d.color + "15" : "transparent",
//                 border: `1px solid ${email === d.email ? d.color : "var(--border)"}`,
//                 borderRadius: 10, padding: "10px 6px", cursor: "pointer",
//                 color: email === d.email ? d.color : "var(--text2)",
//                 fontSize: 12, fontWeight: 600, transition: "all .2s ease", textAlign: "center",
//               }}>
//                 <div style={{ fontSize: 18, marginBottom: 4 }}>{d.icon}</div>
//                 {d.label}
//               </button>
//             ))}
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//             <Alert message={error} />

//             <div style={{ marginBottom: 16 }}>
//               <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>Email</label>
//               <input type="email" value={email} onChange={e => setEmail(e.target.value)}
//                 style={{ width: "100%" }} placeholder="email@example.com" required />
//             </div>

//             <div style={{ marginBottom: 24 }}>
//               <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>Password</label>
//               <input type="password" value={password} onChange={e => setPassword(e.target.value)}
//                 style={{ width: "100%" }} placeholder="••••••••" required />
//             </div>

//             <button type="submit" disabled={loading} style={{
//               width: "100%", padding: "14px",
//               background: loading ? "var(--text3)" : "var(--accent)",
//               color: "#fff", border: "none", borderRadius: 10,
//               fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
//               transition: "all .2s", letterSpacing: 0.5,
//               boxShadow: loading ? "none" : "0 4px 15px rgba(217, 119, 6, 0.3)",
//             }}>
//               {loading ? "Signing in…" : "Sign In →"}
//             </button>
//           </form>

//           {/* Divider */}
//           <div style={{
//             width: "100%", display: "flex", alignItems: "center", gap: 12,
//             margin: "24px 0",
//           }}>
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//             <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>OR</span>
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//           </div>

//           {/* Register link */}
//           <Link to="/register" style={{
//             width: "100%", display: "block", textAlign: "center",
//             padding: "12px", border: "1px solid var(--border)",
//             borderRadius: 10, color: "var(--text2)", fontSize: 14,
//             fontWeight: 600, textDecoration: "none",
//             transition: "all .2s", background: "rgba(255, 255, 255, 0.5)",
//           }}>
//             New user? Create an account →
//           </Link>

//           <p style={{ textAlign: "center", fontSize: 12, color: "var(--text3)", marginTop: 24 }}>
//             Demo password: <strong style={{ color: "var(--text2)" }}>password</strong>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/UI";

const DEMO = [
  { label: "Admin", email: "admin@library.com", icon: "🛡️", color: "var(--rose)" },
  { label: "Librarian", email: "librarian@library.com", icon: "📋", color: "var(--purple)" },
  { label: "Member", email: "john@example.com", icon: "👤", color: "var(--teal)" },
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
      setError(err.response?.data?.message || "Login failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── LIVE WALLPAPER ANIMATION ── */}
      <style>
        {`
          @keyframes cinematicPan {
            0%   { transform: scale(1.05) translate(0%, 0%); }
            50%  { transform: scale(1.1) translate(-2%, -1%); }
            100% { transform: scale(1.05) translate(0%, 0%); }
          }
          .live-wallpaper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2560&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            animation: cinematicPan 40s infinite ease-in-out;
            z-index: -2;
          }
          .wallpaper-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
            z-index: -1;
          }
        `}
      </style>

      {/* Background Elements */}
      <div className="live-wallpaper"></div>
      <div className="wallpaper-overlay"></div>

      {/* Main Content */}
      <div className="fade-in" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        zIndex: 1
      }}>
        
        {/* ── Solid Premium Card ── */}
        <div style={{
          display: "flex",
          width: "100%",
          maxWidth: 1000,
          minHeight: 600,
          background: "#ffffff",
          borderRadius: 20,
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
        }}>
          
          {/* ── Left Panel — Features & Branding ── */}
          <div style={{
            flex: 1,
            background: "#f8fafc", 
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}>
            <div style={{ textAlign: "center", maxWidth: 360 }}>
              <div style={{
                fontSize: 72, marginBottom: 24,
                filter: "drop-shadow(0 8px 12px rgba(79, 70, 229, 0.15))",
              }}>📚</div>

              <h1 style={{
                fontSize: 36, fontWeight: 800, color: "#0f172a",
                letterSpacing: -1, marginBottom: 16, lineHeight: 1.2,
              }}>
                Your Library,<br />
                <span style={{ color: "#4f46e5" }}>Digitized.</span>
              </h1>

              <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
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
                  background: "#ffffff", 
                  border: "1px solid #e2e8f0",
                  borderRadius: 12, padding: "12px 16px", marginBottom: 12,
                  textAlign: "left", boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
                }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span>
                  <span style={{ color: "#0f172a", fontSize: 14, fontWeight: 600 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel — Login Form ── */}
          <div style={{
            width: 440,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px",
            background: "#ffffff",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28, width: "100%" }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -.3 }}>
                Welcome Back
              </h2>
              <p style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
            </div>

            {/* Demo tiles */}
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1, width: "100%", fontWeight: 700 }}>
              Quick Demo Access
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, width: "100%" }}>
              {DEMO.map(d => (
                <button type="button" key={d.email} onClick={() => setEmail(d.email)} style={{
                  flex: 1,
                  background: email === d.email ? d.color + "15" : "#f8fafc",
                  border: `1px solid ${email === d.email ? d.color : "#e2e8f0"}`,
                  borderRadius: 10, padding: "10px 6px", cursor: "pointer",
                  color: email === d.email ? d.color : "#475569",
                  fontSize: 12, fontWeight: 600, transition: "all .2s ease", textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{d.icon}</div>
                  {d.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Alert message={error} />

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%" }} placeholder="email@example.com" required />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%" }} placeholder="••••••••" required />
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "14px",
                background: loading ? "#94a3b8" : "#4f46e5",
                color: "#ffffff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s", letterSpacing: 0.5,
                boxShadow: loading ? "none" : "0 4px 14px rgba(79, 70, 229, 0.3)",
              }}>
                {loading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            <div style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              margin: "24px 0",
            }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <Link to="/register" style={{
              width: "100%", display: "block", textAlign: "center",
              padding: "12px", border: "1px solid #e2e8f0",
              borderRadius: 10, color: "#475569", fontSize: 14,
              fontWeight: 600, textDecoration: "none",
              transition: "all .2s", background: "#f8fafc",
            }}>
              New user? Create an account →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}