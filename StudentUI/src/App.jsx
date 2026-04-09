import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5050";

function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const [page, setPage] = useState(token ? "dashboard" : "login");

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken("");
    setPage("login");
  };

  if (page === "login" || !token) {
    return <Login onLogin={(t) => { setToken(t); setPage("dashboard"); }} />;
  }
  return <Dashboard token={token} onLogout={logout} />;
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("jwt", data.data.token);
        onLogin(data.data.token);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Cannot connect to API. Make sure the server is running on port 5050.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f4" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e0ddd6", borderRadius: 16, padding: "2.5rem", width: 360 }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: 40, height: 40, background: "#E6F1FB", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "#1a1a1a" }}>Student Management</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Sign in to continue</p>
        </div>

        {error && (
          <div style={{ background: "#FCEBEB", border: "0.5px solid #F09595", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#A32D2D", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Username</label>
          <input
            type="text" value={form.username} placeholder="admin"
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password" value={form.password} placeholder="Admin@123"
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "10px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 16 }}>
          Demo: admin / Admin@123 &nbsp;|&nbsp; user / User@123
        </p>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students`, { headers });
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch { showToast("Failed to fetch students", "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/students/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) { showToast("Student deleted"); fetchStudents(); }
      else showToast(data.message, "error");
    } catch { showToast("Delete failed", "error"); }
    setDeleteConfirm(null);
  };

  const openAdd = () => { setEditStudent(null); setShowModal(true); };
  const openEdit = (s) => { setEditStudent(s); setShowModal(true); };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#FCEBEB" : "#EAF3DE", border: `0.5px solid ${toast.type === "error" ? "#F09595" : "#97C459"}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: toast.type === "error" ? "#A32D2D" : "#3B6D11", fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0ddd6", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#E6F1FB", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontWeight: 500, fontSize: 15, color: "#1a1a1a" }}>Student Management</span>
          </div>
          <button onClick={onLogout} style={{ fontSize: 13, color: "#666", background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Students</h2>
            <p style={{ fontSize: 13, color: "#888", margin: "2px 0 0" }}>{students.length} total</p>
          </div>
          <button onClick={openAdd} style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add student
          </button>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e0ddd6", borderRadius: 12, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>Loading...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>No students yet. Click "Add student" to get started.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid #e0ddd6" }}>
                  {["Name", "Email", "Age", "Course", "Added", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "#888" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? "0.5px solid #f0ede8" : "none" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#185FA5", flexShrink: 0 }}>
                          {s.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>{s.email}</td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>{s.age}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#E6F1FB", color: "#0C447C", fontSize: 12, padding: "2px 8px", borderRadius: 4 }}>{s.course}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#999", fontSize: 13 }}>
                      {new Date(s.createdDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(s)} style={{ fontSize: 12, color: "#185FA5", background: "#E6F1FB", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => setDeleteConfirm(s)} style={{ fontSize: 12, color: "#A32D2D", background: "#FCEBEB", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <StudentModal
          student={editStudent}
          token={token}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchStudents(); showToast(editStudent ? "Student updated" : "Student added"); }}
          onError={(msg) => showToast(msg, "error")}
        />
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", width: 360, border: "0.5px solid #e0ddd6" }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px" }}>Delete student?</h3>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 1.5rem" }}>This will permanently delete <strong>{deleteConfirm.name}</strong>.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 16px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{ padding: "8px 16px", border: "none", borderRadius: 8, background: "#A32D2D", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentModal({ student, token, onClose, onSaved, onError }) {
  const [form, setForm] = useState({ name: student?.name || "", email: student?.email || "", age: student?.age || "", course: student?.course || "" });
  const [loading, setLoading] = useState(false);
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.age || !form.course) { onError("All fields are required"); return; }
    setLoading(true);
    try {
      const url = student ? `${API_BASE}/api/students/${student.id}` : `${API_BASE}/api/students`;
      const method = student ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, age: parseInt(form.age) }) });
      const data = await res.json();
      if (data.success) onSaved();
      else onError(data.message || "Something went wrong");
    } catch { onError("Request failed"); }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", width: 420, border: "0.5px solid #e0ddd6" }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 1.25rem" }}>{student ? "Edit student" : "Add student"}</h3>
        {[["Name", "name", "text", "John Doe"], ["Email", "email", "email", "john@example.com"], ["Age", "age", "number", "22"], ["Course", "course", "text", "Computer Science"]].map(([label, key, type, placeholder]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>{label}</label>
            <input
              type={type} value={form[key]} placeholder={placeholder}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "1.25rem" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: "8px 16px", border: "none", borderRadius: 8, background: "#185FA5", color: "#fff", fontSize: 13, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : student ? "Update" : "Add student"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
