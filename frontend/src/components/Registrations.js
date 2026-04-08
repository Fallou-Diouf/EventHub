import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/registrations.css"

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // 🔹 Form
  const [form, setForm] = useState({
    participant: "",
    event: ""
  });

  // 🔹 LOAD DATA
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/registrations/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://127.0.0.1:8000/participants/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://127.0.0.1:8000/events/", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([r1, r2, r3]) => {
        if (!r1.ok || !r2.ok || !r3.ok) throw new Error();

        const data1 = await r1.json();
        const data2 = await r2.json();
        const data3 = await r3.json();

        setRegistrations(data1);
        setParticipants(data2);
        setEvents(data3);
      })
      .catch(() => setError("Erreur chargement"))
      .finally(() => setLoading(false));
  }, [token]);

  // 🔹 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 🔹 CHANGE FORM
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 CREATE REGISTRATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.participant || !form.event) {
      alert("Sélection obligatoire");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/registrations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participant_id: form.participant,
          event_id: form.event
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.non_field_errors?.[0] || "Erreur inscription"
        );
      }

      setRegistrations(prev => [...prev, data]);

      alert("✅ Inscription réussie");

      setForm({ participant: "", event: "" });

    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette inscription ?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/registrations/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error();

      setRegistrations(prev => prev.filter(r => r.id !== id));
      alert("🗑 Supprimé");

    } catch {
      alert("Erreur suppression");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/events">Events</Link>
          <Link to="/participants">Participants</Link>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </nav>
        <h2>📝 Inscriptions</h2>
      </header>

      <section className="content">

        {loading && <p className="info">Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {/* FORM */}
        {isAdmin && (
          <form className="card" onSubmit={handleSubmit}>
            <h3>➕ Nouvelle inscription</h3>

            <select
              name="participant"
              value={form.participant}
              onChange={handleChange}
            >
              <option value="">-- Participant --</option>
              {participants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              name="event"
              value={form.event}
              onChange={handleChange}
            >
              <option value="">-- Event --</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>

            <button className="btn success">Inscrire</button>
          </form>
        )}

        {/* LIST */}
        <ul className="event-list">
          {registrations.map(r => (
            <li key={r.id} className="event-card">

              <div className="event-info">
                <h4>{r.participant?.name}</h4>
                <p>➡️ {r.event?.title}</p>
              </div>

              {isAdmin && (
                <div className="actions">
                  <button
                    className="btn danger small"
                    onClick={() => handleDelete(r.id)}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

      </section>
    </div>
  );
}

export default Registrations;