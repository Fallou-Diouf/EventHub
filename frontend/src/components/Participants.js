import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/participants.css"

function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // 🔹 Formulaire
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [editingId, setEditingId] = useState(null);

  // 🔹 LOAD
  useEffect(() => {
    fetch("http://127.0.0.1:8000/participants/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setParticipants(data))
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [token]);

  // 🔹 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      alert("Nom et email obligatoires");
      return;
    }

    const url = editingId
      ? `http://127.0.0.1:8000/participants/${editingId}/`
      : "http://127.0.0.1:8000/participants/";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Erreur serveur");
      }

      const data = await response.json();

      if (editingId) {
        setParticipants(prev =>
          prev.map(p => (p.id === editingId ? data : p))
        );
        alert("✏️ Modifié");
      } else {
        setParticipants(prev => [...prev, data]);
        alert("✅ Ajouté");
      }

      // Reset form
      setForm({ name: "", email: "", phone: "" });
      setEditingId(null);

    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce participant ?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/participants/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error();

      setParticipants(prev => prev.filter(p => p.id !== id));
      alert("🗑 Supprimé");

    } catch {
      alert("Erreur suppression");
    }
  };

  // 🔹 EDIT MODE
  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      email: p.email || "",
      phone: p.phone || ""
    });
    setEditingId(p.id);
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/events">Events</Link>
          <Link to="/registrations">Registrations</Link>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </nav>
        <h2>👥 Participants</h2>
      </header>

      <section className="content">

        {loading && <p className="info">Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {/* FORM */}
        {isAdmin && (
          <form className="card" onSubmit={handleSubmit}>
            <h3>{editingId ? "✏️ Modifier participant" : "➕ Ajouter participant"}</h3>

            <input
              name="name"
              placeholder="Nom"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="phone"
              type="text"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="actions">
              <button className="btn success" type="submit">
                {editingId ? "Modifier" : "Ajouter"}
              </button>

              {editingId && (
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", email: "", phone: "" });
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        )}

        {/* LIST */}
        <ul className="event-list">
          {participants.map(p => (
            <li key={p.id} className="event-card">

              <div className="event-info">
                <h4>{p.name}</h4>
                <p>{p.email}</p>
                {p.phone && <span className="phone">{p.phone}</span>}
              </div>

              {isAdmin && (
                <div className="actions">
                  <button className="btn small" onClick={() => handleEdit(p)}>Modifier</button>
                  <button className="btn danger small" onClick={() => handleDelete(p.id)}>Supprimer</button>
                </div>
              )}
            </li>
          ))}
        </ul>

      </section>
    </div>
  );
}

export default Participants;