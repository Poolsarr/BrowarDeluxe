import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import theme from './theme';
import Home from "./pages/Home";
import Batches from "./pages/Batches";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";
import Users from "./pages/Users";
import Invoices from "./pages/Invoices";
import Auth from "./pages/Auth";

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub || payload.login || payload.username);
      } catch {
        setUsername(null);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/users" element={<Users />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
