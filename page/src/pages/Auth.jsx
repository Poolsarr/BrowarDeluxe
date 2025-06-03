import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    setSuccess("");

    // Walidacja klienta – upewnij się, że nie wysyłasz pustych danych
    if (!login.trim() || !password.trim()) {
      setError("Login i hasło są wymagane.");
      return;
    }

    const url = `http://localhost:5000/${isLogin ? "login" : "register"}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim(), password: password.trim() }),
      });

      const contentType = res.headers.get("Content-Type") || "";

      // Obsługa błędu serwera
      if (!res.ok) {
        const errMsg = contentType.includes("application/json")
          ? (await res.json()).error
          : await res.text();
        throw new Error(errMsg || "Błąd operacji");
      }

      if (isLogin) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", login);
        navigate("/");
      } else {
        setSuccess("Rejestracja zakończona sukcesem!");
        setLogin("");
        setPassword("");
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (err) {
      setError(err.message || "Wystąpił błąd");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ padding: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            BrowarDeluxe
          </Typography>
          <Typography variant="h6">
            {isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </Typography>
        </Box>

        <Tabs
          value={isLogin ? 0 : 1}
          onChange={(_, val) => {
            setIsLogin(val === 0);
            setError("");
            setSuccess("");
          }}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Logowanie" />
          <Tab label="Rejestracja" />
        </Tabs>

        <TextField
          fullWidth
          label="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleAuth}
        >
          {isLogin ? "Zaloguj" : "Zarejestruj"}
        </Button>
      </Paper>
    </Container>
  );
};

export default Auth;
