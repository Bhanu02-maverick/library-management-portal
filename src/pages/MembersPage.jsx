import { useState, useEffect, useCallback } from "react";
import { usersAPI, borrowsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader, Card, Button, Badge, Avatar,
  Table, Modal, FormField, SearchInput, Pagination, Spinner, Alert
} from "../components/UI";

const ROLE_COLOR = { admin: "var(--rose)", librarian: "var(--purple)", member: "var(--teal)" };

export default function MembersPage() {
  const { user } = useAuth();
  const [members,  setMembers]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // Member detail
  const [selected,    setSelected]    = useState(null);
  const [memberBorrows, setMemberBorrows] = useState([]);
  const [detailLoad,  setDetailLoad]  = useState(false);

  // Edit modal
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoad, setEditLoad] = useState(false);
  const [editErr,  setEditErr]  = useState("");

  const fetchMembers = useCallback(() => {
    setLoading(true);
    usersAPI.getAll({ search, page, limit: 20 })
      .then(res => {
        setMembers(res.data.users);
        setTotal(res.data.total);
        setPages(res.data.pages || 1);
      })
      .catch(err => setError(err.response?.data?.message || "Failed to load members"))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);
  useEffect(() => { setPage(1); }, [search]);

  async function openDetail(member) {
    setSelected(member);
    setDetailLoad(true);
    try {
      const res = await borrowsAPI.getAll({ user_id: member.id, limit: 10 });
      setMemberBorrows(res.data.borrows || []);
    } catch { setMemberBorrows([]); }
    finally { setDetailLoad(false); }
  }

  async function handleEdit() {
    setEditLoad(true); setEditErr("");
    try {
      await usersAPI.update(editUser.id, editForm);
      setEditUser(null);
      fetchMembers();
    } catch (e) {
      setEditErr(e.response?.data?.message || "Update failed");
    } finally { setEditLoad(false); }
  }

  const columns = [
    { key: "name", label: "Member", render: (v, row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={v} color={ROLE_COLOR[row.role]} size={32} />
        <div>
          <div style={{ fontWeight: 600, color: "var(--text1)" }}>{v}</div>
          <div style={{ fontSize: 11, color: "var(--text2)" }}>{row.email}</div>
        </div>
      </div>
    )},
    { key: "role",      label: "Role",    render: v => <Badge color={ROLE_COLOR[v] || "var(--accent)"}>{v}</Badge> },
    { key: "phone",     label: "Phone",   render: v => <span style={{ color: "var(--text2)", fontSize: 12 }}>{v || "—"}</span> },
    { key: "joined_at", label: "Joined",  render: v => <span style={{ color: "var(--text2)", fontSize: 12 }}>{v?.split("T")[0] || v}</span> },
    { key: "is_active", label: "Status",  render: v => <Badge color={v ? "var(--green)" : "var(--rose)"}>{v ? "Active" : "Inactive"}</Badge> },
    { key: "id", label: "Actions", render: (v, row) => (
      <div style={{ display: "flex", gap: 6 }}>
        <Button size="sm" variant="ghost" onClick={() => openDetail(row)}>View</Button>
        {user.role === "admin" && (
          <Button size="sm" variant="outline" onClick={() => { setEditUser(row); setEditForm({ name: row.name, phone: row.phone || "", address: row.address || "", is_active: row.is_active, role: row.role }); }}>
            Edit
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="👥 Members"
        subtitle={`${total} registered users`}
      />

      <Alert message={error} />

      <div style={{ marginBottom: 20, maxWidth: 380 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" />
      </div>

      <Card style={{ padding: 0 }}>
        {loading
          ? <div style={{ display: "flex", justifyContent: "center", padding: 50 }}><Spinner size={32} /></div>
          : <Table columns={columns} data={members} emptyMsg="No members found" />
        }
      </Card>
      <Pagination page={page} pages={pages} onPage={setPage} />

      {/* Member Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`👤 ${selected?.name}`} maxWidth={520}>
        {selected && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <Avatar name={selected.name} color={ROLE_COLOR[selected.role]} size={56} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text1)" }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{selected.email}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <Badge color={ROLE_COLOR[selected.role]}>{selected.role}</Badge>
                  <Badge color={selected.is_active ? "var(--green)" : "var(--rose)"}>
                    {selected.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[["Phone", selected.phone || "—"], ["Joined", selected.joined_at?.split("T")[0] || selected.joined_at]].map(([k, v]) => (
                <div key={k} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 13px" }}>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: .7, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)", marginBottom: 12 }}>Recent Borrows</h4>
            {detailLoad
              ? <div style={{ textAlign: "center", padding: 20 }}><Spinner /></div>
              : memberBorrows.length === 0
              ? <p style={{ color: "var(--text3)", fontSize: 13 }}>No borrow history</p>
              : memberBorrows.slice(0, 5).map(b => (
                <div key={b.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0", borderBottom: "1px solid var(--border)22",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.book_title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>Due: {b.due_date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {b.fine_amount > 0 && <span style={{ color: "var(--rose)", fontSize: 12, fontWeight: 600 }}>₹{b.fine_amount}</span>}
                    <Badge color={b.status === "active" ? "var(--green)" : b.status === "overdue" ? "var(--rose)" : "var(--text2)"}>{b.status}</Badge>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User" maxWidth={400}>
        {editUser && (
          <div>
            <Alert message={editErr} />
            <FormField label="Full Name">
              <input style={{ width: "100%" }} value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </FormField>
            <FormField label="Phone">
              <input style={{ width: "100%" }} value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91..." />
            </FormField>
            <FormField label="Address">
              <textarea style={{ width: "100%", height: 70 }} value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
            </FormField>
            <FormField label="Role">
              <select style={{ width: "100%" }} value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>
                <option value="member">Member</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ width: "100%" }} value={editForm.is_active ? "1" : "0"} onChange={e => setEditForm(p => ({ ...p, is_active: e.target.value === "1" }))}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Button onClick={handleEdit} disabled={editLoad}>{editLoad ? <Spinner size={14} /> : null} Save Changes</Button>
              <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
