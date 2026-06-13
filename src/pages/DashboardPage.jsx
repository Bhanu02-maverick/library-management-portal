import { useState, useEffect } from "react";
import { statsAPI, borrowsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StatCard, Card, StatusBadge, PageHeader, Spinner, Badge } from "../components/UI";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const icons = {
  books:   ({ size, color }) => <span style={{ fontSize: size, color }}>📚</span>,
  members: ({ size, color }) => <span style={{ fontSize: size, color }}>👥</span>,
  borrows: ({ size, color }) => <span style={{ fontSize: size, color }}>🔄</span>,
  overdue: ({ size, color }) => <span style={{ fontSize: size, color }}>⚠️</span>,
  fines:   ({ size, color }) => <span style={{ fontSize: size, color }}>💰</span>,
  returns: ({ size, color }) => <span style={{ fontSize: size, color }}>✅</span>,
};

// ── MEMBER DASHBOARD ──────────────────────────────────────────
function MemberDashboard() {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    borrowsAPI.getAll({ limit: 50 })
      .then(res => setBorrows(res.data.borrows))
      .catch(err => console.error("Failed to load borrows", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36} /></div>;

  const activeBorrows = borrows.filter(b => b.status === "active" || b.status === "overdue");
  const pastBorrows = borrows.filter(b => b.status === "returned");
  
  const estimatedOverdueFines = activeBorrows.reduce((sum, b) => sum + (b.days_overdue > 0 ? b.days_overdue * 1 : 0), 0);

  return (
    <div className="fade-in">
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}!`} subtitle="Here is your reading overview" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Books Currently Borrowed" value={activeBorrows.length} color="var(--accent)" icon={icons.books} />
        <StatCard label="Books Read (Total)" value={pastBorrows.length} color="var(--teal)" icon={icons.returns} />
        <StatCard label="Pending Fines" value={`$${estimatedOverdueFines.toFixed(2)}`} color={estimatedOverdueFines > 0 ? "var(--rose)" : "var(--green)"} icon={icons.fines} />
      </div>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text1)", marginBottom: 16 }}>📖 My Current Books</h3>
        
        {activeBorrows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🛋️</div>
            You don't have any books checked out right now.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {activeBorrows.map(b => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8
              }}>
                <div style={{ width: 40, height: 60, background: "var(--border2)", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                  {b.cover_url ? <img src={b.cover_url} alt={b.book_title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text1)" }}>{b.book_title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
                    Issued: {b.issued_date.split('T')[0]} &nbsp;•&nbsp; 
                    <span style={{ color: b.days_overdue > 0 ? "var(--rose)" : "var(--text2)" }}>
                      Due: {b.due_date.split('T')[0]}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {b.days_overdue > 0 ? (
                    <Badge color="var(--rose)">Overdue by {b.days_overdue} days</Badge>
                  ) : (
                    <Badge color="var(--accent)">{Math.abs(b.days_overdue)} days left</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── ADMIN / LIBRARIAN DASHBOARD ───────────────────────────────
function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    statsAPI.dashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}><Spinner size={36} /></div>;

  if (error) return (
    <div style={{ background: "var(--rose)12", border: "1px solid var(--rose)30", borderRadius: 12, padding: 24, color: "var(--rose)", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
      <strong>Could not load dashboard</strong>
      <p style={{ marginTop: 6, fontSize: 13 }}>{error}</p>
    </div>
  );

  const { stats, byCategory = [], recentActivity = [], trend = [] } = data;

  const statCards = [
    { label: "Total Books",    value: stats.totalBooks,    color: "var(--accent)",  icon: icons.books   },
    { label: "Members",        value: stats.totalMembers,  color: "var(--teal)",    icon: icons.members },
    { label: "Active Borrows", value: stats.activeIssues,  color: "var(--purple)",  icon: icons.borrows },
    { label: "Overdue",        value: stats.overdueCount,  color: "var(--rose)",    icon: icons.overdue },
    { label: "Unpaid Fines",   value: `$${Number(stats.totalFines).toFixed(2)}`, color: "var(--amber)", icon: icons.fines },
    { label: "Returned Today", value: stats.returnedToday, color: "var(--green)",   icon: icons.returns },
  ];

  return (
    <div className="fade-in">
      <PageHeader title="Library Dashboard" subtitle="Real-time library statistics" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 18 }}>📈 Monthly Borrow Trend</h3>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trend}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text2)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text2)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "var(--text1)" }} itemStyle={{ color: "var(--accent)" }} />
                <Bar dataKey="borrows" fill="var(--accent)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 13 }}>No borrow data yet</div>}
        </Card>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 18 }}>📂 Books by Category</h3>
          {byCategory.map(c => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text1)" }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.count} books</span>
              </div>
              <div style={{ background: "var(--surface)", borderRadius: 4, height: 5 }}>
                <div style={{ background: c.color || "var(--accent)", borderRadius: 4, height: 5, width: `${Math.min(100, (c.count / (stats.totalBooks || 1)) * 100)}%`, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  
  if (user?.role === "member") {
    return <MemberDashboard />;
  }
  
  return <AdminDashboard />;
}