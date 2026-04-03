import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem("token", data.access);

        // Extraire le rôle depuis le JWT
        const payload = JSON.parse(atob(data.access.split(".")[1]));
        localStorage.setItem("role", payload.role);

        navigate("/dashboard");
      } else {
        alert("Login échoué !");
      }
    } catch (error) {
      console.log("Erreur réseau", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>🔐 Connexion</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Entrer votre username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Entrer votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn primary full" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
