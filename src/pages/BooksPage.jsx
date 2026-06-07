import { useState, useEffect, useCallback } from "react";
import { booksAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader, Card, Button, Badge, Modal, FormField,
  SearchInput, Pagination, Spinner, Alert
} from "../components/UI";

const CATEGORIES = ["Fiction","Science","History","Technology","Philosophy","Biography","Mathematics","Arts & Literature"];

function BookCard({ book, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onClick={() => onClick(book)} style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden", cursor: "pointer",
      transition: "transform .2s, border-color .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; }}>
      <div style={{
        height: 170, background: (book.category_color || "#3b82f6") + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {book.cover_url && !imgErr ? (
          <img src={book.cover_url} alt={book.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgErr(true)} />
        ) : (
          <span style={{ fontSize: 48 }}>📖</span>
        )}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <span style={{
            background: book.available_copies > 0 ? "var(--green)22" : "var(--rose)22",
            color: book.available_copies > 0 ? "var(--green)" : "var(--rose)",
            border: `1px solid ${book.available_copies > 0 ? "var(--green)" : "var(--rose)"}44`,
            padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
          }}>
            {book.available_copies > 0 ? `${book.available_copies} avail` : "Unavailable"}
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)", marginBottom: 3, lineHeight: 1.3, fontFamily: "var(--font-head)" }}>
          {book.title}
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>{book.author_name}</div>
        <Badge color={book.category_color || "var(--accent)"}>{book.category_name}</Badge>
      </div>
    </div>
  );
}

function BookForm({ initial = {}, onSubmit, onCancel, loading, error }) {
  const [form, setForm] = useState({
    title: "", author_id: "", category_id: "", isbn: "", publisher: "",
    published_year: "", description: "", cover_url: "", total_copies: 1,
    shelf_location: "", language: "English", pages: "", ...initial,
  });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <Alert message={error} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Title *" style={{ gridColumn: "1/-1" }}>
          <input style={{ width: "100%" }} value={form.title} onChange={set("title")} placeholder="Book title" />
        </FormField>
        <FormField label="Author ID *">
          <input style={{ width: "100%" }} value={form.author_id} onChange={set("author_id")} placeholder="Author ID (from DB)" type="number" />
        </FormField>
        <FormField label="Category ID">
          <input style={{ width: "100%" }} value={form.category_id} onChange={set("category_id")} placeholder="Category ID" type="number" />
        </FormField>
        <FormField label="ISBN">
          <input style={{ width: "100%" }} value={form.isbn} onChange={set("isbn")} placeholder="978-..." />
        </FormField>
        <FormField label="Publisher">
          <input style={{ width: "100%" }} value={form.publisher} onChange={set("publisher")} placeholder="Publisher name" />
        </FormField>
        <FormField label="Published Year">
          <input style={{ width: "100%" }} value={form.published_year} onChange={set("published_year")} placeholder="e.g. 1984" type="number" />
        </FormField>
        <FormField label="Pages">
          <input style={{ width: "100%" }} value={form.pages} onChange={set("pages")} placeholder="e.g. 320" type="number" />
        </FormField>
        <FormField label="Total Copies">
          <input style={{ width: "100%" }} value={form.total_copies} onChange={set("total_copies")} type="number" min="1" />
        </FormField>
        <FormField label="Shelf Location">
          <input style={{ width: "100%" }} value={form.shelf_location} onChange={set("shelf_location")} placeholder="e.g. A-01" />
        </FormField>
        <FormField label="Cover Image URL" style={{ gridColumn: "1/-1" }}>
          <input style={{ width: "100%" }} value={form.cover_url} onChange={set("cover_url")} placeholder="https://..." />
        </FormField>
        <FormField label="Description" style={{ gridColumn: "1/-1" }}>
          <textarea style={{ width: "100%", height: 80, resize: "vertical" }} value={form.description} onChange={set("description")} placeholder="Brief description..." />
        </FormField>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Button onClick={() => onSubmit(form)} disabled={loading}>
          {loading ? <Spinner size={14} /> : null} {initial.id ? "Update Book" : "Add Book"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const { user } = useAuth();
  const [books,   setBooks]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [formLoad, setFormLoad] = useState(false);
  const [formErr,  setFormErr]  = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [error,    setError]    = useState("");

  const canManage = user.role === "admin" || user.role === "librarian";

  const fetchBooks = useCallback(() => {
    setLoading(true);
    booksAPI.getAll({ search, page, limit: 12 })
      .then(res => {
        setBooks(res.data.books);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(err => setError(err.response?.data?.message || "Failed to load books"))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search]);

  async function handleAdd(form) {
    setFormLoad(true); setFormErr("");
    try {
      await booksAPI.create(form);
      setShowAdd(false);
      fetchBooks();
    } catch (e) {
      setFormErr(e.response?.data?.message || "Failed to add book");
    } finally { setFormLoad(false); }
  }

  async function handleEdit(form) {
    setFormLoad(true); setFormErr("");
    try {
      await booksAPI.update(editBook.id, form);
      setEditBook(null); setSelected(null);
      fetchBooks();
    } catch (e) {
      setFormErr(e.response?.data?.message || "Failed to update book");
    } finally { setFormLoad(false); }
  }

  async function handleDelete(id) {
    try {
      await booksAPI.delete(id);
      setDeleteId(null); setSelected(null);
      fetchBooks();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete book");
    }
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="📚 Book Inventory"
        subtitle={`${total} books in collection`}
        action={canManage && (
          <Button icon="➕" onClick={() => setShowAdd(true)}>Add Book</Button>
        )}
      />

      <Alert message={error} />

      {/* Search bar */}
      <div style={{ marginBottom: 20, maxWidth: 400 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search books, authors, ISBN…" />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner size={36} /></div>
      ) : books.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          No books found{search && ` for "${search}"`}
        </Card>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 18, marginBottom: 24 }}>
            {books.map(b => <BookCard key={b.id} book={b} onClick={setSelected} />)}
          </div>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {/* Book Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ""} maxWidth={540}>
        {selected && (
          <div>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 18 }}>by {selected.author_name}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                ["Category",  selected.category_name],
                ["Published", selected.published_year],
                ["Pages",     selected.pages],
                ["ISBN",      selected.isbn],
                ["Location",  selected.shelf_location],
                ["Copies",    `${selected.available_copies} / ${selected.total_copies}`],
                ["Language",  selected.language],
                ["Publisher", selected.publisher],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 13px" }}>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: .7, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: "var(--text1)", fontWeight: 500 }}>{v || "—"}</div>
                </div>
              ))}
            </div>
            {selected.description && (
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16, padding: "12px 14px", background: "var(--surface)", borderRadius: 8 }}>
                {selected.description}
              </p>
            )}
            {canManage && (
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <Button variant="ghost" onClick={() => { setEditBook(selected); setSelected(null); }}>✏️ Edit</Button>
                {user.role === "admin" && (
                  <Button variant="danger" onClick={() => { setDeleteId(selected.id); setSelected(null); }}>🗑 Delete</Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Book Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setFormErr(""); }} title="Add New Book" maxWidth={560}>
        <BookForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} loading={formLoad} error={formErr} />
      </Modal>

      {/* Edit Book Modal */}
      <Modal open={!!editBook} onClose={() => { setEditBook(null); setFormErr(""); }} title="Edit Book" maxWidth={560}>
        {editBook && <BookForm initial={editBook} onSubmit={handleEdit} onCancel={() => setEditBook(null)} loading={formLoad} error={formErr} />}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Book?" maxWidth={360}>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
          This will permanently delete the book. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
