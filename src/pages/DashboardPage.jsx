import { useState, useEffect } from "react";
import { statsAPI } from "../services/api";
import { StatCard, Card, StatusBadge, PageHeader, Spinner } from "../components/UI";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const icons = {
  books:   ({ size, color }) => <span style={{ fontSize: size, color }}>📚</span>,
  members: ({ size, color }) => <span style={{ fontSize: size, color }}>👥</span>,
  borrows: ({ size, color }) => <span style={{ fontSize: size, color }}>🔄</span>,
  overdue: ({ size, color }) => <span style={{ fontSize: size, color }}>⚠️</span>,
  fines:   ({ size, color }) => <span style={{ fontSize: size, color }}>💰</span>,
  returns: ({ size, color }) => <span style={{ fontSize: size, color }}>✅</span>,
};

export default function DashboardPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    statsAPI.dashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <Spinner size={36} />
    </div>
  );

  if (error) return (
    <div style={{
      background: "var(--rose)12", border: "1px solid var(--rose)30",
      borderRadius: 12, padding: 24, color: "var(--rose)", textAlign: "center",
    }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
      <strong>Could not load dashboard</strong>
      <p style={{ marginTop: 6, fontSize: 13 }}>{error}</p>
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--text2)" }}>
        Make sure Node.js backend is running: <code>cd backend && npm run dev</code>
      </p>
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
      <PageHeader title="Dashboard" subtitle="Real-time library statistics" />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Borrow Trend */}
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 18 }}>
            📈 Monthly Borrow Trend
          </h3>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trend}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text2)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text2)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--text1)" }}
                  itemStyle={{ color: "var(--accent)" }}
                />
                <Bar dataKey="borrows" fill="var(--accent)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 13 }}>
              No borrow data yet
            </div>
          )}
        </Card>

        {/* Books by Category */}
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 18 }}>
            📂 Books by Category
          </h3>
          {byCategory.map(c => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text1)" }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "var(--text2)" }}>{c.count} books</span>
              </div>
              <div style={{ background: "var(--surface)", borderRadius: 4, height: 5 }}>
                <div style={{
                  background: c.color || "var(--accent)", borderRadius: 4, height: 5,
                  width: `${Math.min(100, (c.count / (stats.totalBooks || 1)) * 100)}%`,
                  transition: "width .5s",
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)", marginBottom: 16 }}>
          🕒 Recent Borrow Activity
        </h3>
        {recentActivity.length === 0 ? (
          <p style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No activity yet</p>
        ) : (
          <div>
            {recentActivity.map(a => (
              <div key={a.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid var(--border)22",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text1)" }}>{a.book}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>
                    {a.member} · Issued {a.issued_date} · Due {a.due_date}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
