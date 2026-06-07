import React from "react";

/* ── Spinner ──────────────────────────────────────────── */
export function Spinner({ size = 22 }) {
  return (
    <div style={{
      width: size, height: size,
      border: "2px solid var(--border2)",
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin .7s linear infinite",
      display: "inline-block",
      flexShrink: 0,
    }} />
  );
}

/* ── Button ───────────────────────────────────────────── */
export function Button({ children, variant = "primary", size = "md", onClick, type = "button", disabled, style = {}, icon }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    border: "none", borderRadius: 8, fontFamily: "var(--font-body)",
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .15s", opacity: disabled ? .5 : 1,
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
    padding: size === "sm" ? "6px 13px" : size === "lg" ? "12px 24px" : "9px 18px",
  };
  const variants = {
    primary: { background: "var(--accent)",  color: "#fff" },
    danger:  { background: "var(--rose)",    color: "#fff" },
    success: { background: "var(--green)",   color: "#071a0f" },
    ghost:   { background: "transparent",    color: "var(--text2)", border: "1px solid var(--border)" },
    outline: { background: "transparent",    color: "var(--accent)", border: "1px solid var(--accent)" },
    amber:   { background: "var(--amber)",   color: "#1a0e00" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon && icon}{children}
    </button>
  );
}

/* ── Badge ────────────────────────────────────────────── */
export function Badge({ children, color = "var(--accent)" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      background: color + "22", color,
    }}>
      {children}
    </span>
  );
}

/* ── Status Badge ─────────────────────────────────────── */
export function StatusBadge({ status }) {
  const map = {
    active:   { color: "var(--green)",  label: "Active"   },
    returned: { color: "var(--text2)",  label: "Returned" },
    overdue:  { color: "var(--rose)",   label: "Overdue"  },
    pending:  { color: "var(--amber)",  label: "Pending"  },
    lost:     { color: "var(--rose)",   label: "Lost"     },
  };
  const s = map[status] || map.active;
  return <Badge color={s.color}>{s.label}</Badge>;
}

/* ── Card ─────────────────────────────────────────────── */
export function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 12, padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Stat Card ────────────────────────────────────────── */
export function StatCard({ label, value, color, icon: Icon, sub }) {
  return (
    <Card style={{ borderTop: `3px solid ${color}`, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text1)", lineHeight: 1, fontFamily: "var(--font-head)" }}>
            {value}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6, textTransform: "uppercase", letterSpacing: .8 }}>
            {label}
          </div>
          {sub && <div style={{ fontSize: 11, color, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ background: color + "18", borderRadius: 9, padding: 9 }}>
          <Icon size={18} color={color} />
        </div>
      </div>
    </Card>
  );
}

/* ── Table ────────────────────────────────────────────── */
export function Table({ columns, data, emptyMsg = "No records found" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: "10px 14px", textAlign: "left",
                color: "var(--text2)", borderBottom: "1px solid var(--border)",
                fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: .6,
                whiteSpace: "nowrap",
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 13 }}>
                {emptyMsg}
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={row.id || i} style={{ transition: "background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {columns.map(c => (
                <td key={c.key} style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--border)22",
                  color: "var(--text1)", verticalAlign: "middle",
                }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, maxWidth = 500 }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24,
    }}>
      <div className="fade-in" style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 28, width: "100%", maxWidth,
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text1)" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text2)", fontSize: 18, lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── FormField ────────────────────────────────────────── */
export function FormField({ label, error, children, style = {} }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 5 }}>{label}</label>}
      {children}
      {error && <p style={{ fontSize: 11, color: "var(--rose)", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

/* ── Alert ────────────────────────────────────────────── */
export function Alert({ type = "error", message }) {
  if (!message) return null;
  const colors = { error: "var(--rose)", success: "var(--green)", warning: "var(--amber)", info: "var(--accent)" };
  const c = colors[type] || colors.error;
  return (
    <div style={{
      background: c + "15", border: `1px solid ${c}40`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
      color: c, marginBottom: 16,
    }}>
      {message}
    </div>
  );
}

/* ── Search Input ─────────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text3)" }}>🔍</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: 33, width: "100%", minWidth: 240 }}
      />
    </div>
  );
}

/* ── Avatar ───────────────────────────────────────────── */
export function Avatar({ name = "", size = 34, color = "var(--accent)" }) {
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * .35, fontWeight: 700,
      color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Page Header ──────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text1)", letterSpacing: -.3 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Pagination ───────────────────────────────────────── */
export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          width: 32, height: 32, borderRadius: 6, border: "1px solid",
          borderColor: p === page ? "var(--accent)" : "var(--border)",
          background: p === page ? "var(--accent)" : "transparent",
          color: p === page ? "#fff" : "var(--text2)",
          cursor: "pointer", fontSize: 12, fontWeight: 500,
        }}>{p}</button>
      ))}
    </div>
  );
}
