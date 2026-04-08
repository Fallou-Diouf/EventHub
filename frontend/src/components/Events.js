import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/events.css"; // Assurez-vous que le chemin est correct

function Events() {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");

  // Formulaire création / édition
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    status: "upcoming",
  });

  const [editingEvent, setEditingEvent] = useState(null);

  // Filtres
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 🔹 Récupérer le rôle depuis le token JWT
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (err) {
        console.error("Token invalide", err);
      }
    }
  }, [token]);

  // 🔹 Charger la liste des events
  const loadEvents = async () => {
    if (!token) return;
    let url = "http://127.0.0.1:8000/events/";
    const params = [];

    if (filterDate) params.push(`date=${filterDate}`);
    if (filterStatus) params.push(`status=${filterStatus}`);
    if (params.length) url += "?" + params.join("&");

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de charger les events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [token, filterDate, filterStatus]);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // 🔹 CREATE
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Création échouée");
      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      setForm({ title: "", description: "", date: "", location: "", status: "upcoming" });
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 UPDATE
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/events/${editingEvent.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingEvent),
      });

      if (!res.ok) throw new Error("Mise à jour échouée");
      const updated = await res.json();
      setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
      setEditingEvent(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 DELETE
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/events/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Suppression échouée");
      setEvents(events.filter(ev => ev.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <h2>Liste des événements</h2>
      </header>

      {/* 🔍 FILTRE */}
      <form className="filter-form" onSubmit={e => { e.preventDefault(); loadEvents(); }}>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">-- Tous --</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="btn success">Filtrer</button>
      </form>

      {/* ➕ CREATE (ADMIN) */}
      {role === "admin" && !editingEvent && (
        <form className="event-form card" onSubmit={handleCreateEvent}>
          <h3>Ajouter un événement</h3>
          <input placeholder="Titre" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <input placeholder="Lieu" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn success">Ajouter</button>
        </form>
      )}

      {/* ✏️ EDIT FORM */}
      {editingEvent && role === "admin" && (
        <form className="event-form card" onSubmit={handleUpdateEvent}>
          <h3>Modifier événement</h3>
          <input value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
          <input value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} />
          <input type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} />
          <input value={editingEvent.location} onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} />
          <select value={editingEvent.status} onChange={e => setEditingEvent({...editingEvent, status: e.target.value})}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn success">Sauvegarder</button>
          <button type="button" className="btn danger" onClick={() => setEditingEvent(null)}>Annuler</button>
        </form>
      )}

      {/* 📋 LISTE DES EVENTS */}
      <ul className="event-list">
        {events.map(e => (
          <li key={e.id} className="event-card">
            <strong>{e.title}</strong> - {e.date} | {e.status} | {e.location}
            <div className="actions">
              {role === "admin" && (
                <>
                  <button className="btn small" onClick={() => setEditingEvent(e)}>Modifier</button>
                  <button className="btn danger small" onClick={() => handleDeleteEvent(e.id)}>Supprimer</button>
                </>
              )}
              <Link to={`/events/${e.id}`}><button className="btn small">Voir détails</button></Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;