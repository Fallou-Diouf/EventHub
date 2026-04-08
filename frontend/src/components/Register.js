import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Compte créé !");
        navigate("/");
      } else {
        const data = await res.json();
        alert("Erreur : " + JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      alert("Erreur réseau");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleRegister}>
        <h2>📝 Inscription</h2>

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            placeholder="Entrer votre username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            name="password"
            type="password"
            placeholder="Entrer votre mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn primary full">
          S'inscrire
        </button>

        {/* 🔹 Lien DANS la card */}
        <p>
          Déjà un compte ?{" "}
          <span className="link" onClick={() => navigate("/")}>
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;