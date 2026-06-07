import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./UI";

const NAV = [
  { to: "/",        label: "Dashboard", icon: "📊", roles: ["admin","librarian","member"] },
  { to: "/books",   label: "Books",     icon: "📚", roles: ["admin","librarian","member"] },
  { to: "/borrows", label: "Borrows",   icon: "🔄", roles: ["admin","librarian","member"] },
  { to: "/members", label: "Members",   icon: "👥", roles: ["admin","librarian"] },
  { to: "/profile", label: "Profile",   icon: "👤", roles: ["admin","librarian","member"] },
];

const ROLE_COLOR = { admin: "var(--rose)", librarian: "var(--purple)", member: "var(--teal)" };

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const visible = NAV.filter(n => n.roles.includes(user?.role));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 230, background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", padding: "20px 0",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: "var(--accent)18",
              border: "1px solid var(--accent)44", borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>📖</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text1)", fontFamily: "var(--font-head)", letterSpacing: -.3 }}>
                LibraryOS
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>Management Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 10px" }}>
          {visible.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, marginBottom: 2,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--accent)" : "var(--text2)",
              background: isActive ? "var(--accent)12" : "transparent",
              textDecoration: "none", transition: "all .15s",
            })}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 14px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar name={user?.name} color={ROLE_COLOR[user?.role]} />
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 10, color: ROLE_COLOR[user?.role], textTransform: "capitalize", fontWeight: 600 }}>
                {user?.role}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", background: "transparent", border: "1px solid var(--border)",
            borderRadius: 7, padding: "7px", color: "var(--text2)", cursor: "pointer",
            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all .15s",
          }}
            onMouseEnter={e => { e.target.style.background = "var(--card2)"; e.target.style.color = "var(--rose)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--text2)"; }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
        }}>
          <div style={{
            background: "var(--amber)12", border: "1px solid var(--amber)30",
            borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "var(--amber)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ⚠️ Backend: <code style={{ fontFamily: "monospace", color: "var(--text1)" }}>localhost:5000</code>
          </div>
          <div style={{
            background: "var(--green)12", border: "1px solid var(--green)30",
            borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "var(--green)",
          }}>
            ● Connected
          </div>
        </header>

        <main style={{ flex: 1, padding: 28, overflowY: "auto" }} className="fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
