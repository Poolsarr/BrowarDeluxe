// components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ username, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/batches" className="hover:underline">Batches</Link>
        <Link to="/inventory" className="hover:underline">Inventory</Link>
        <Link to="/recipes" className="hover:underline">Recipes</Link>
        <Link to="/users" className="hover:underline">Users</Link>
      </div>
      <div className="flex items-center space-x-4">
        {username ? (
          <>
            <span>Zalogowany: <strong>{username}</strong></span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Wyloguj
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Zaloguj</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
