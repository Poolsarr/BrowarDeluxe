import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Batches from "./pages/Batches";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/batches">Batches</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batches" element={<Batches />} />
      </Routes>
    </Router>
  );
}

export default App;
