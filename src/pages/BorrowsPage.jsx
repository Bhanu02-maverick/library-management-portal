import { useState, useEffect, useCallback } from "react";
import { borrowsAPI, booksAPI, usersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader, Card, Button, StatusBadge, Table,
  Modal, FormField, Pagination, Spinner, Alert, Badge
} from "../components/UI";

export default function BorrowsPage() {
  const { user } = useAuth();
  const [borrows,  setBorrows]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [page,     setPage]     = useState(1);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  // Issue modal
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ user_id: "", book_id: "", notes: "" });
  const [issueLoad, setIssueLoad] = useState(false);
  const [issueErr,  setIssueErr]  = useState("");

  // Return confirm
  const [returnId,  setReturnId]  = useState(null);
  const [returnRes, setReturnRes] = useState(null);

  // Autocomplete data
  const [members, setMembers] = useState([]);
  const [availBooks, setAvailBooks] = useState([]);

  const canManage = user.role !== "member";
  
  // Calculate default due date (14 days from today)
  const borrowDueDate = new Date(Date.now() + 14 * 86400000)
    .toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const fetchBorrows = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (filter !== "all") params.status = filter;
    
    borrowsAPI.getAll(params)
      .then(res => {
        setBorrows(res.data.borrows);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(err => setError(err.response?.data?.message || "Failed to load borrows"))
      .finally(() => setLoading(false));
  }, [page, filter]);

  useEffect(() => { fetchBorrows(); }, [fetchBorrows]);
  useEffect(() => { setPage(1); }, [filter]);

  // Load members and available books when the Issue modal opens
  useEffect(() => {
    if (!showIssue) return;
    usersAPI.getAll({ role: "member", limit: 100 })
      .then(res => setMembers(res.data.users || []))
      .catch(() => {});
    booksAPI.getAll({ available: "true", limit: 100 })
      .then(res => setAvailBooks(res.data.books || []))
      .catch(() => {});
  }, [showIssue]);

  async function handleIssue() {
    if (!issueForm.user_id || !issueForm.book_id) {
      setIssueErr("Please select both a member and a book."); return;
    }
    setIssueLoad(true); setIssueErr("");
    try {
      await borrowsAPI.issue(issueForm);
      setShowIssue(false);
      setIssueForm({ user_id: "", book_id: "", notes: "" });
      setSuccess("Book successfully issued to member!");
      fetchBorrows();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setIssueErr(e.response?.data?.message || "Failed to issue book");
    } finally { setIssueLoad(false); }
  }

  async function handleReturn(id) {
    try {
      const res = await borrowsAPI.return(id);
      setReturnId(null);
      setReturnRes(res.data);
      fetchBorrows();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to return book");
    }
  }

  const tabs = ["all", "active", "returned"];

  const columns = [
    { key: "book_title",   label: "Book",    render: (v) => (
      <div style={{ fontWeight: 600, color: "var(--text1)" }}>{v}</div>
    )},
    { key: "member_name",  label: "Member",  render: v => <span style={{ color: "var(--text2)" }}>{v}</span> },
    { key: "issued_date",  label: "Issued",  render: v => <span style={{ fontSize: 12, color: "var(--text2)" }}>{v.split('T')[0]}</span> },
    { key: "due_date",     label: "Due Date", render: (v, row) => {
      const isOverdue = row.status === "active" && row.days_overdue > 0;
      return (
        <span style={{
          fontSize: 12, fontWeight: isOverdue ? 700 : 400,
          color: isOverdue ? "var(--rose)" : "var(--text2)",
        }}>
          {v.split('T')[0]} {isOverdue && ` (${row.days_overdue} days late)`}
        </span>
      )
    }},
    { key: "status",       label: "Status",  render: (v, row) => {
      const displayStatus = (row.status === "active" && row.days_overdue > 0) ? "overdue" : v;
      return <StatusBadge status={displayStatus} />
    }},
    { key: "fine_amount",  label: "Fine",    render: v => v > 0
      ? <span style={{ color: "var(--rose)", fontWeight: 700 }}>${Number(v).toFixed(2)}</span>
      : <span style={{ color: "var(--text3)" }}>—</span>
    },
    { key: "id", label: "Action", render: (v, row) => (
      canManage && row.status === "active"
        ? <Button size="sm" variant="ghost" onClick={() => setReturnId(v)}>Return Book</Button>
        : null
    )},
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="🔄 Borrowing Desk"
        subtitle={`${total} active and past borrow records`}
        action={canManage && (
          <Button icon="➕" onClick={() => setShowIssue(true)}>Issue Book</Button>
        )}
      />

      <Alert message={error} />
      {success && <Alert type="success" message={success} />}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: "pointer", textTransform: "capitalize", transition: "all .15s",
            background: filter === t ? "var(--accent)" : "var(--surface)",
            color:      filter === t ? "#fff" : "var(--text2)",
            border: `1px solid ${filter === t ? "var(--accent)" : "var(--border)"}`,
          }}>{t}</button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        {loading
          ? <div style={{ display: "flex", justifyContent: "center", padding: 50 }}><Spinner size={32} /></div>
          : <Table columns={columns} data={borrows} emptyMsg="No borrow records found" />
        }
      </Card>
      <Pagination page={page} pages={pages} onPage={setPage} />

      {/* Issue Book Modal */}
      <Modal open={showIssue} onClose={() => { setShowIssue(false); setIssueErr(""); }} title="Issue a Book" maxWidth={440}>
        <Alert message={issueErr} />
        <FormField label="Select Member *">
          <select style={{ width: "100%" }} value={issueForm.user_id}
            onChange={e => setIssueForm(p => ({ ...p, user_id: e.target.value }))}>
            <option value="">— Select a student/member —</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
            ))}
          </select>
        </FormField>
        <FormField label="Select Book *">
          <select style={{ width: "100%" }} value={issueForm.book_id}
            onChange={e => setIssueForm(p => ({ ...p, book_id: e.target.value }))}>
            <option value="">— Select an available book —</option>
            {availBooks.map(b => (
              <option key={b.id} value={b.id}>{b.title} — {b.available_copies} copies left</option>
            ))}
          </select>
        </FormField>
        <FormField label="Notes (optional)">
          <textarea style={{ width: "100%", height: 70 }} value={issueForm.notes}
            onChange={e => setIssueForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Any special notes..." />
        </FormField>
        <div style={{
          background: "var(--accent)10", border: "1px solid var(--accent)30",
          borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "var(--text2)",
        }}>
          📅 Due date will be calculated as: <strong style={{ color: "var(--text1)" }}>{borrowDueDate}</strong> (14 days)
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={handleIssue} disabled={issueLoad}>
            {issueLoad ? <Spinner size={14} /> : null} Complete Issue
          </Button>
          <Button variant="ghost" onClick={() => setShowIssue(false)}>Cancel</Button>
        </div>
      </Modal>

      {/* Return Confirm Modal */}
      <Modal open={!!returnId} onClose={() => setReturnId(null)} title="Return Book" maxWidth={360}>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
          Are you sure you want to mark this book as returned? Any applicable late fines will be processed automatically.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="success" onClick={() => handleReturn(returnId)}>✅ Confirm Return</Button>
          <Button variant="ghost" onClick={() => setReturnId(null)}>Cancel</Button>
        </div>
      </Modal>

      {/* Return Result Modal */}
      <Modal open={!!returnRes} onClose={() => setReturnRes(null)} title="Book Returned" maxWidth={360}>
        {returnRes && (
          <div>
            <div style={{
              background: "var(--green)10", border: "1px solid var(--green)30",
              borderRadius: 10, padding: 18, marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>Return Successful</div>
              {returnRes.fine_amount > 0 ? (
                <div style={{ marginTop: 10, color: "var(--rose)", fontWeight: 600 }}>
                  Late Fine Charged: ${Number(returnRes.fine_amount).toFixed(2)} ({returnRes.days_late} days late)
                </div>
              ) : (
                <div style={{ marginTop: 10, color: "var(--text2)", fontSize: 13 }}>No fine — book was returned on time!</div>
              )}
            </div>
            <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => setReturnRes(null)}>Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}