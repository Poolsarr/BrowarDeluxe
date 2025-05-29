import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserStatus = () => {
  const [serverStatus, setServerStatus] = useState("⏳ Sprawdzanie...");
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzenie statusu serwera <- na razie wyłączone
    const pingServer = async () => {
      try {
        const res = await fetch("http://localhost:5000/");
        if (res.ok) {
          setServerStatus("🟢 Serwer działa");
        } else {
          setServerStatus("🟠 Problem z serwerem");
        }
      } catch {
        setServerStatus("🔴 Brak połączenia z serwerem");
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub || payload.login || payload.username || "Nieznany");
      } catch (e) {
        setUsername("Nieznany");
      }
    }


    pingServer();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      right: 20,
      textAlign: "right",
      fontSize: "0.9rem",
      color: "#333"
    }}>
      {username ? (
        <>
          <div>Zalogowany: <strong>{username}</strong></div>
          <button onClick={handleLogout} style={{ marginTop: "4px" }}>
            Wyloguj
          </button>
        </>
      ) : (
        <div>Nie jesteś zalogowany</div>
      )}
      <div>Status serwera: {serverStatus}</div>
    </div>
  );
};

export default UserStatus;
