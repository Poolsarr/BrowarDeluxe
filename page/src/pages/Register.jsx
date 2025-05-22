import React, { useState } from "react";

const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Rejestracja udana! Możesz się teraz zalogować.");
        setLogin("");
        setPassword("");
      } else {
        setMessage(`❌ Błąd: ${data.msg || "Nie udało się zarejestrować."}`);
      }
    } catch (err) {
      console.error("Błąd:", err);
      setMessage("❌ Wystąpił błąd podczas rejestracji.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rejestracja</h2>
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Login"
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
      />
      <br />
      <button onClick={handleRegister}>Zarejestruj</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
