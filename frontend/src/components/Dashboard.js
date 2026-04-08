import "../style/dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eRes, pRes, rRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/events/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/participants/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/registrations/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const eData = await eRes.json();
        const pData = await pRes.json();
        const rData = await rRes.json();

        // 🔹 Forcer tableau même si réponse paginée
        setEvents(Array.isArray(eData) ? eData : eData.results || []);
        setParticipants(Array.isArray(pData) ? pData : pData.results || []);
        setRegistrations(Array.isArray(rData) ? rData : rData.results || []);
      } catch (err) {
        console.error("Erreur chargement dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return <p className="info">Chargement...</p>;

  // 🔹 Chart data for event status
  const statusCounts = {
    upcoming: events.filter(e => e.status === "upcoming").length,
    ongoing: events.filter(e => e.status === "ongoing").length,
    completed: events.filter(e => e.status === "completed").length,
  };

  const data = {
    labels: ["Upcoming", "Ongoing", "Completed"],
    datasets: [
      {
        label: "Events by Status",
        data: [statusCounts.upcoming, statusCounts.ongoing, statusCounts.completed],
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/events">Events</Link>
          <Link to="/participants">Participants</Link>
          <Link to="/registrations">Registrations</Link>
          <Link to="/dashboard">Dashboard</Link>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </nav>
        <h2>📊 Dashboard</h2>
      </header>

      <section className="dashboard">
        <div className="stat-card">
          <h3>{events.length}</h3>
          <p>Events</p>
        </div>
        <div className="stat-card">
          <h3>{participants.length}</h3>
          <p>Participants</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.length}</h3>
          <p>Registrations</p>
        </div>
      </section>

      <section className="charts">
        <h3>Event Status Overview</h3>
        <Bar data={data} />
      </section>

      <section className="recent-lists">
        <div>
          <h4>Derniers événements</h4>
          {events.length === 0 ? (
            <p>Aucun événement disponible</p>
          ) : (
            <ul>
              {events.slice(-3).reverse().map(e => (
                <li key={e.id}>{e.title} ({e.status})</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4>Derniers participants</h4>
          {participants.length === 0 ? (
            <p>Aucun participant disponible</p>
          ) : (
            <ul>
              {participants.slice(-3).reverse().map(p => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;