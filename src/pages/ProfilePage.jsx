import { useState } from "react";
import { usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card, Button, Badge, Avatar, FormField, Alert, Spinner } from "../components/UI";

const ROLE_COLOR = { admin: "var(--rose)", librarian: "var(--purple)", member: "var(--teal)" };

export default function ProfilePage() {
  const { user } = useAuth();
  const [form,    setForm]    = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error,   setError]   = useState("");

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSave() {
    setLoading(true); setError(""); setSuccess("");
    try {
      await usersAPI.update(user.id, form);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <PageHeader title="👤 My Profile" subtitle="Manage your account information" />

      {/* Profile Card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
          <Avatar name={user?.name} color={ROLE_COLOR[user?.role]} size={64} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text1)", fontFamily: "var(--font-head)" }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{user?.email}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <Badge color={ROLE_COLOR[user?.role]}>{user?.role}</Badge>
              <Badge color="var(--green)">Active</Badge>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            ["User ID", `#${user?.id}`],
            ["Email", user?.email],
            ["Role", user?.role],
            ["Member Since", user?.joined_at?.split("T")[0] || "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: .7, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Form */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text1)", marginBottom: 18 }}>Edit Information</h3>
        <Alert message={error} />
        {success && <Alert type="success" message={success} />}

        <FormField label="Full Name">
          <input style={{ width: "100%" }} value={form.name} onChange={set("name")} />
        </FormField>
        <FormField label="Phone">
          <input style={{ width: "100%" }} value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
        </FormField>
        <FormField label="Address">
          <textarea style={{ width: "100%", height: 90, resize: "vertical" }} value={form.address} onChange={set("address")} placeholder="Your address..." />
        </FormField>

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Spinner size={14} /> : null} Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
