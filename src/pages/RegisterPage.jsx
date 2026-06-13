// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { authAPI } from "../services/api";
// import { Alert } from "../components/UI";

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [form, setForm] = useState({
//     name: "", email: "", password: "", confirmPassword: "", phone: "", role: "member"
//   });
//   const [error,   setError]   = useState("");
//   const [loading, setLoading] = useState(false);

//   const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     if (!form.name || !form.email || !form.password) { setError("Name, email and password are required"); return; }
//     if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
//     if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
//     setLoading(true);
//     try {
//       await authAPI.register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role });
//       await login(form.email, form.password);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Try again.");
//     } finally { setLoading(false); }
//   }

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-body)" }}>

//       {/* ── Left Panel ── */}
//       <div style={{
//         flex: 1, display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center", padding: 48,
//        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://media.istockphoto.com/id/2105516746/photo/confident-student-holding-books-in-library.jpg?s=612x612&w=0&k=20&c=fOsYfzTKXdcLbaup4KEuOVWYeL7T6JTWjSG7QNE2VuE=') center/cover no-repeat`,
//         position: "relative", overflow: "hidden",
//       }}>
//         {[
//           { w:400, h:400, top:"-100px", left:"-100px", color:"#a855f720" },
//           { w:300, h:300, top:"50%",    left:"60%",    color:"#3b82f615" },
//           { w:200, h:200, top:"70%",    left:"10%",    color:"#14b8a620" },
//         ].map((c,i) => (
//           <div key={i} style={{
//             position:"absolute", width:c.w, height:c.h,
//             borderRadius:"50%", background:c.color,
//             top:c.top, left:c.left, filter:"blur(40px)",
//           }}/>
//         ))}

//         <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
//           <div style={{ fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 0 30px #a855f760)" }}>🏛️</div>
//           <h1 style={{
//             fontSize: 34, fontWeight: 800, color: "#e2e8f0",
//             fontFamily: "var(--font-head)", letterSpacing: -1,
//             marginBottom: 16, lineHeight: 1.2,
//           }}>
//             Join the<br/>
//             <span style={{ color: "#a855f7" }}>Library Community</span>
//           </h1>
//           <p style={{ color: "#7d8fa8", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
//             Create your account and get access to thousands of books instantly.
//           </p>
//           {[
//             { icon: "✅", text: "Free to join" },
//             { icon: "📚", text: "Access all books" },
//             { icon: "🔔", text: "Due date reminders" },
//             { icon: "📱", text: "Track your borrows" },
//           ].map(f => (
//             <div key={f.text} style={{
//               display: "flex", alignItems: "center", gap: 12,
//               background: "#ffffff08", border: "1px solid #ffffff12",
//               borderRadius: 10, padding: "10px 16px", marginBottom: 10, textAlign: "left",
//             }}>
//               <span style={{ fontSize: 16 }}>{f.icon}</span>
//               <span style={{ color: "#94a3b8", fontSize: 13 }}>{f.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Right Panel — Register Form ── */}
//       <div style={{
//         width: 440, background: "#080c14",

//         display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center",
//         padding: "40px 36px",
//         borderLeft: "1px solid #1e2a3d",
//         overflowY: "auto",
//       }}>
//         <div style={{ textAlign: "center", marginBottom: 24, width: "100%" }}>
//           <div style={{
//             width: 52, height: 52, background: "#a855f718",
//             border: "1px solid #a855f740", borderRadius: 14,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 24, margin: "0 auto 14px",
//           }}>🏛️</div>
//           <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", fontFamily: "var(--font-head)", letterSpacing: -.3 }}>
//             Create Account
//           </h2>
//           <p style={{ color: "#7d8fa8", fontSize: 13, marginTop: 4 }}>Join the Library Portal today</p>
//         </div>


//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           <Alert message={error} />

//           {/* Name */}
//           <div style={{ marginBottom: 12 }}>
//             <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Full Name *</label>
//             <input type="text" value={form.name} onChange={set("name")}
//               style={{ width: "100%" }} placeholder="John Doe" required />
//           </div>

//           {/* Email */}
//           <div style={{ marginBottom: 12 }}>
//             <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Email *</label>
//             <input type="email" value={form.email} onChange={set("email")}
//               style={{ width: "100%" }} placeholder="john@example.com" required />
//           </div>

//           {/* Phone + Role side by side */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
//             <div>
//               <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Phone</label>
//               <input type="text" value={form.phone} onChange={set("phone")}
//                 style={{ width: "100%" }} placeholder="+91 98765..." />
//             </div>
//             <div>
//               <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Role</label>
//               <select value={form.role} onChange={set("role")} style={{ width: "100%" }}>
//                 <option value="member">Member</option>
//                 <option value="librarian">Librarian</option>
//               </select>
//             </div>
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom: 12 }}>
//             <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Password *</label>
//             <input type="password" value={form.password} onChange={set("password")}
//               style={{ width: "100%" }} placeholder="Min 6 characters" required />
//           </div>

//           {/* Confirm Password */}
//           <div style={{ marginBottom: 22 }}>
//             <label style={{ fontSize: 12, color: "#7d8fa8", display: "block", marginBottom: 5 }}>Confirm Password *</label>
//             <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
//               style={{ width: "100%", borderColor: form.confirmPassword && form.password !== form.confirmPassword ? "#f43f5e" : "" }}
//               placeholder="Repeat password" required />
//             {form.confirmPassword && form.password !== form.confirmPassword && (
//               <p style={{ fontSize: 11, color: "#f43f5e", marginTop: 4 }}>❌ Passwords do not match</p>
//             )}
//             {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
//               <p style={{ fontSize: 11, color: "#22c55e", marginTop: 4 }}>✅ Passwords match</p>
//             )}
//           </div>

//           <button type="submit" disabled={loading} style={{
//             width: "100%", padding: "12px",
//             background: loading ? "#2d1f47" : "linear-gradient(135deg, #a855f7, #7c3aed)",
//             color: "#fff", border: "none", borderRadius: 9,
//             fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
//             transition: "all .2s", letterSpacing: .3,
//             boxShadow: loading ? "none" : "0 4px 20px #a855f740",
//           }}>
//             {loading ? "Creating account…" : "Create Account →"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
//           <div style={{ flex: 1, height: 1, background: "#1e2a3d" }}/>
//           <span style={{ fontSize: 11, color: "#3d4f63" }}>OR</span>
//           <div style={{ flex: 1, height: 1, background: "#1e2a3d" }}/>
//         </div>

//         <Link to="/login" style={{
//           width: "100%", display: "block", textAlign: "center",
//           padding: "11px", border: "1px solid #1e2a3d",
//           borderRadius: 9, color: "#7d8fa8", fontSize: 13,
//           fontWeight: 600, textDecoration: "none",
//           transition: "all .15s", background: "#0f1520",
//         }}
//           onMouseEnter={e => { e.target.style.borderColor = "#a855f7"; e.target.style.color = "#a855f7"; }}
//           onMouseLeave={e => { e.target.style.borderColor = "#1e2a3d"; e.target.style.color = "#7d8fa8"; }}
//         >
//           Already have an account? Sign In →
//         </Link>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Alert } from "../components/UI";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", role: "member"
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role });
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally { setLoading(false); }
  }

  // Helper for glassy input styles
  const inputStyle = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "8px",
    outline: "none",
    fontSize: "13px"
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      fontFamily: "var(--font-body)",
      /* ── Background is now on the Main Container to span the entire screen ── */
      background: `url('https://media.istockphoto.com/id/2105516746/photo/confident-student-holding-books-in-library.jpg?s=612x612&w=0&k=20&c=fOsYfzTKXdcLbaup4KEuOVWYeL7T6JTWjSG7QNE2VuE=') center/cover no-repeat fixed`
    }}>

      {/* ── Left Panel ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 48,
        /* Slight gradient to make sure the left text is readable, but fades out towards the right */
        background: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {[
          { w:400, h:400, top:"-100px", left:"-100px", color:"#a855f720" },
          { w:300, h:300, top:"50%",    left:"60%",    color:"#3b82f615" },
          { w:200, h:200, top:"70%",    left:"10%",    color:"#14b8a620" },
        ].map((c,i) => (
          <div key={i} style={{
            position:"absolute", width:c.w, height:c.h,
            borderRadius:"50%", background:c.color,
            top:c.top, left:c.left, filter:"blur(40px)",
          }}/>
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 80, marginBottom: 24, filter: "drop-shadow(0 0 30px #a855f760)" }}>🏛️</div>
          <h1 style={{
            fontSize: 34, fontWeight: 800, color: "#ffffff",
            fontFamily: "var(--font-head)", letterSpacing: -1,
            marginBottom: 16, lineHeight: 1.2,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)"
          }}>
            Join the<br/>
            <span style={{ color: "#c084fc" }}>Library Community</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.7, marginBottom: 36, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Create your account and get access to thousands of books instantly.
          </p>
          {[
            { icon: "✅", text: "Free to join" },
            { icon: "📚", text: "Access all books" },
            { icon: "🔔", text: "Due date reminders" },
            { icon: "📱", text: "Track your borrows" },
          ].map(f => (
            <div key={f.text} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 10, textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Dark Glass Register Form ── */}
      <div style={{
        width: 440, 
        /* ── This replaces the solid dark background with a translucent blur ── */
        background: "rgba(8, 12, 20, 0.70)", 
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "-10px 0 30px rgba(0,0,0,0.3)",

        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 36px",
        overflowY: "auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24, width: "100%" }}>
          <div style={{
            width: 52, height: 52, background: "rgba(168, 85, 247, 0.2)",
            border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 14px",
          }}>🏛️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-head)", letterSpacing: -.3 }}>
            Create Account
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: 13, marginTop: 4 }}>Join the Library Portal today</p>
        </div>


        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Alert message={error} />

          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Full Name *</label>
            <input type="text" value={form.name} onChange={set("name")}
              style={inputStyle} placeholder="John Doe" required />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Email *</label>
            <input type="email" value={form.email} onChange={set("email")}
              style={inputStyle} placeholder="john@example.com" required />
          </div>

          {/* Phone + Role side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Phone</label>
              <input type="text" value={form.phone} onChange={set("phone")}
                style={inputStyle} placeholder="+91 98765..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Role</label>
              <select value={form.role} onChange={set("role")} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="member" style={{ color: "#000" }}>Member</option>
                <option value="librarian" style={{ color: "#000" }}>Librarian</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Password *</label>
            <input type="password" value={form.password} onChange={set("password")}
              style={inputStyle} placeholder="Min 6 characters" required />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12, color: "#cbd5e1", display: "block", marginBottom: 5 }}>Confirm Password *</label>
            <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
              style={{ 
                ...inputStyle, 
                borderColor: form.confirmPassword && form.password !== form.confirmPassword ? "#f43f5e" : "rgba(255, 255, 255, 0.15)" 
              }}
              placeholder="Repeat password" required />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p style={{ fontSize: 11, color: "#f43f5e", marginTop: 4 }}>❌ Passwords do not match</p>
            )}
            {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
              <p style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>✅ Passwords match</p>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "12px",
            background: loading ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg, #a855f7, #7c3aed)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9,
            fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            transition: "all .2s", letterSpacing: .3,
            boxShadow: loading ? "none" : "0 4px 20px rgba(168, 85, 247, 0.3)",
          }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}/>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}/>
        </div>

        <Link to="/login" style={{
          width: "100%", display: "block", textAlign: "center",
          padding: "11px", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 9, color: "#cbd5e1", fontSize: 13,
          fontWeight: 600, textDecoration: "none",
          transition: "all .15s", background: "rgba(255,255,255,0.05)",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; }}
        >
          Already have an account? Sign In →
        </Link>
      </div>
    </div>
  );
}