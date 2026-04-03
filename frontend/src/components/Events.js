import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Events() {
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");

  // Création
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("upcoming");

  // Filtrage
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Edition
  const [editingEvent, setEditingEvent] = useState(null);

  // 🔹 Récupérer le rôle
  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    }
  }, [token]);

  // 🔹 Charger events
  const loadEvents = async () => {
    let url = "http://127.0.0.1:8000/events/";
    const params = [];

    if (filterDate) params.push(`date=${filterDate}`);
    if (filterStatus) params.push(`status=${filterStatus}`);

    if (params.length) url += "?" + params.join("&");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 🔹 CREATE
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, date, location, status }),
    });

    if (res.ok) {
      const newEvent = await res.json();
      setEvents([...events, newEvent]);

      setTitle(""); setDescription(""); setDate(""); setLocation(""); setStatus("upcoming");
    }
  };

  // 🔹 UPDATE
  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://127.0.0.1:8000/events/${editingEvent.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingEvent),
    });

    if (res.ok) {
      const updated = await res.json();

      setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
      setEditingEvent(null);
    }
  };

  // 🔹 DELETE
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Supprimer cet event ?")) return;

    const res = await fetch(`http://127.0.0.1:8000/events/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <>
      <header>
        <nav>
          <Link to="/participants">Participants</Link>
          <Link to="/registrations">Registrations</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <h2>Liste des événements</h2>
      </header>

      <section>

        {/* 🔍 FILTRE */}
        <form onSubmit={(e) => { e.preventDefault(); loadEvents(); }}>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">-- Tous --</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Filtrer</button>
        </form>

        {/* ➕ CREATE (ADMIN) */}
        {role === "admin" && (
          <form onSubmit={handleCreateEvent}>
            <h3>Ajouter un événement</h3>
            <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
            <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input placeholder="Lieu" value={location} onChange={e => setLocation(e.target.value)} />
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">Ajouter</button>
          </form>
        )}

        {/* ✏️ EDIT FORM */}
        {editingEvent && (
          <form onSubmit={handleUpdateEvent}>
            <h3>Modifier événement</h3>

            <input value={editingEvent.title}
              onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />

            <input value={editingEvent.description}
              onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} />

            <input type="date" value={editingEvent.date}
              onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} />

            <input value={editingEvent.location}
              onChange={e => setEditingEvent({...editingEvent, location: e.target.value})} />

            <select value={editingEvent.status}
              onChange={e => setEditingEvent({...editingEvent, status: e.target.value})}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            <button type="submit">Sauvegarder</button>
            <button type="button" onClick={() => setEditingEvent(null)}>Annuler</button>
          </form>
        )}

        {/* 📋 LISTE */}
        <ul>
          {events.map(e => (
            <li key={e.id}>
              <strong>{e.title}</strong> - {e.date} | {e.status} | {e.location}
              <br />

              {role === "admin" && (
                <>
                  <button onClick={() => setEditingEvent(e)}>Modifier</button>
                  <button onClick={() => handleDeleteEvent(e.id)}>Supprimer</button>
                </>
              )}

              <Link to={`/events/${e.id}`}>
                <button>Voir détails</button>
              </Link>
            </li>
          ))}
        </ul>

      </section>
    </>
  );
}

export default Events;