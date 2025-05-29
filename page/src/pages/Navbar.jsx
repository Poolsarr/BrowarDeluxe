import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const navItems = [
  { label: "Batches", path: "/batches", icon: "☰" },
  { label: "Recipes", path: "/recipes", icon: "☰" },
  { label: "Inventory", path: "/inventory", icon: "☰" },
  { label: "Invoices", path: "/invoices", icon: "☰" },
];

const primaryBlue = "#007bff";
const lightBlueHover = "rgba(0, 123, 255, 0.1)";
const activeBlueBackground = "aliceblue";
const textColor = "darkslategrey";
const logoBackgroundColor = "#f8f9fa";

const Navbar = ({ username, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        paddingTop: "8px",
        paddingBottom: "8px",
      }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            edge="start"
            aria-label="logo"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: logoBackgroundColor,
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out",
                backgroundColor: logoBackgroundColor,
              },
            }}
          >
            <img
              src={"/img/deluxe.svg"}
              alt="Logo"
              style={{ height: "45px", width: "30px" }}
            />
          </IconButton>

          <Stack direction="row" spacing={1.5}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={NavLink}
                to={item.path}
                variant="outlined"
                sx={{
                  color: primaryBlue,
                  borderColor: primaryBlue,
                  backgroundColor: "white",
                  textTransform: "none",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontWeight: 500,
                  "& .button-icon": {
                    marginRight: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    color: primaryBlue,
                  },
                  "&:hover": {
                    backgroundColor: lightBlueHover,
                    borderColor: primaryBlue,
                    color: primaryBlue,
                  },
                  "&.active": {
                    backgroundColor: activeBlueBackground,
                    color: textColor,
                    borderColor: activeBlueBackground,
                    fontWeight: "bold",
                    "& .button-icon": {
                      color: textColor,
                    },
                  },
                }}
              >
                <span className="button-icon">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {username ? (
            <>
              <Typography variant="body1" sx={{ mr: 2, color: textColor }}>
                Zalogowany: <strong>{username}</strong>
              </Typography>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "white",
                  borderColor: primaryBlue,
                  "&:hover": { backgroundColor: "lightbluehover" },
                  color: primaryBlue,
                  textTransform: "none",
                }}
              >
                Wyloguj
              </Button>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              variant="contained"
              sx={{
                backgroundColor: "white",
                borderColor: primaryBlue,
                "&:hover": { backgroundColor: "lighbluehover" },
                color: primaryBlue,
                textTransform: "none",
              }}
            >
              Zaloguj
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
