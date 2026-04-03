import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Events from "./components/Events";
import Participants from "./components/Participants";
import Registrations from "./components/Registrations";
import EventDetails from "./components/EventDetails";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login accessible à tous */}
        <Route path="/" element={<Login />} />

        {/* Dashboard accessible à tous les rôles */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["admin", "viewer"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Pages Events, Participants, Registrations */}
        <Route
          path="/events"
          element={
            <PrivateRoute roles={["admin", "viewer"]}>
              <Events />
            </PrivateRoute>
          }
        />

        <Route
          path="/participants"
          element={
            <PrivateRoute roles={["admin", "viewer"]}>
              <Participants />
            </PrivateRoute>
          }
        />

        <Route
          path="/registrations"
          element={
            <PrivateRoute roles={["admin", "viewer"]}>
              <Registrations />
            </PrivateRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <PrivateRoute roles={["admin", "viewer"]}>
              <EventDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;