import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [event, setEvent] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState("");

  // 🔹 Charger event
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/events/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.log(err));
  }, [id, token]);

  // 🔹 Charger participants
  useEffect(() => {
    fetch("http://127.0.0.1:8000/participants/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setParticipantsList(data))
      .catch(err => console.log(err));
  }, [token]);

  // 🔹 INSCRIPTION
  const handleRegisterParticipant = async (e) => {
    e.preventDefault();

    if (!selectedParticipant) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/registrations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participant: selectedParticipant,
          event: event.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Participant inscrit");

        setEvent({
          ...event,
          registrations: [
            ...(event.registrations || []),
            {
              id: data.id,
              participant_name: participantsList.find(p => p.id === selectedParticipant).name,
              registration_date: data.registration_date,
            },
          ],
        });

        setSelectedParticipant("");
      } else {
        alert("⚠️ Participant déjà inscrit");
      }
    } catch (err) {
      alert("❌ Erreur réseau");
    }
  };

  // 🔹 DÉSINSCRIPTION
  const handleUnregister = async (registrationId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/registrations/${registrationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("🔄 Participant désinscrit");

        setEvent({
          ...event,
          registrations: event.registrations.filter(
            r => r.id !== registrationId
          ),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!event) return <p>Chargement...</p>;

  return (
    <div className="container">

      {!event ? (
        <p className="info">Chargement...</p>
      ) : (
        <>
          {/* HEADER EVENT */}
          <div className="card event-header">
            <h2>{event.title}</h2>
            <p className="event-desc">{event.description}</p>

            <div className="event-meta">
              <span>📅 {event.date}</span>
              <span>📍 {event.location}</span>
              <span className={`status ${event.status}`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* PARTICIPANTS */}
          <div className="card">
            <h3>👥 Participants inscrits</h3>

            <ul className="event-list">
              {(event.registrations || []).map((r) => (
                <li key={r.id} className="event-card">

                  <div className="event-info">
                    <h4>{r.participant_name}</h4>
                    <p>Inscrit le {r.registration_date}</p>
                  </div>

                  <div className="actions">
                    <button
                      className="btn danger small"
                      onClick={() => handleUnregister(r.id)}
                    >
                      Désinscrire
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* FORM INSCRIPTION */}
          <div className="card">
            <h3>➕ Inscrire un participant</h3>

            <form onSubmit={handleRegisterParticipant}>
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
              >
                <option value="">-- Choisir un participant --</option>

                {participantsList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>

              <button className="btn success">Inscrire</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default EventDetails;