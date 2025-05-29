import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Science, Inventory, Receipt, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  const quickActions = [
    {
      title: "Partie produkcyjne",
      description: "Zarządzaj partiami piwa",
      icon: <Science sx={{ fontSize: 40 }} />,
      path: "/batches",
      color: "#1976d2",
    },
    {
      title: "Magazyn",
      description: "Kontroluj zapasy składników",
      icon: <Inventory sx={{ fontSize: 40 }} />,
      path: "/inventory",
      color: "#2e7d32",
    },
    {
      title: "Receptury",
      description: "Katalog przepisów na piwo",
      icon: <Assignment sx={{ fontSize: 40 }} />,
      path: "/recipes",
      color: "#ed6c02",
    },
    {
      title: "Faktury",
      description: "Dokumenty i rozliczenia",
      icon: <Receipt sx={{ fontSize: 40 }} />,
      path: "/invoices",
      color: "#9c27b0",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Logout Button */}
      <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Wyloguj
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          Dashboard BrowarDeluxe
        </Typography>
        <Typography variant="h6" color="text.secondary">
          System zarządzania browarem
        </Typography>
      </Box>

      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <img
          src="/img/deluxe_main.svg"
          alt="BrowarDeluxe Logo"
          style={{ maxWidth: "400px", marginBottom: "40px" }}
        />
      </Box>

      {/* Menu */}
      <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: action.color,
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(action.path)}
                  sx={{
                    bgcolor: action.color,
                    "&:hover": {
                      bgcolor: action.color,
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  Przejdź
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
