import React, { useState } from "react";
import axios from "axios";

const TestPage = () => {
  const [message, setMessage] = useState("");

  const pingServer = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      setMessage(response.data);
    } catch (error) {
      setMessage("Błąd połączenia z serwerem");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={pingServer}>Pinguj backend</button>
      <p>Odpowiedź serwera: {message}</p>
    </div>
  );
};

export default TestPage;
