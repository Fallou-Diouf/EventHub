import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access);
      localStorage.setItem("role", data.role);
      navigate("/dashboard");
    } else {
      alert("Login échoué");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn primary">Se connecter</button>

        <p onClick={() => navigate("/register")} className="link">
          S'inscrire
        </p>
      </form>
    </div>
  );
}

export default Login;