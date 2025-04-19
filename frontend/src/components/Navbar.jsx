import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // or "/login"
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#f0fdf4", borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            textDecoration: "none",
            color: "#1b5e20",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          SkillBridge
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {[
            "Home",
            "Dashboard",
            "Skills Analysis",
            "Learning Paths",
            "Job Matching",
            "Credentials",
          ].map((item) => (
            <Button
              key={item}
              color="inherit"
              href="#"
              sx={{
                fontWeight: 500,
                color: "#2e7d32",
                textTransform: "none",
                ":hover": { backgroundColor: "#e8f5e9", borderRadius: 1 },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <Brightness7Icon sx={{ color: "#1b5e20" }} />
          </IconButton>

          {localStorage.getItem("token") && (
            <>
              <Avatar
                sx={{ bgcolor: "#d1f5d3", color: "#1b5e20", fontSize: 14 }}
              >
                {JSON.parse(localStorage.getItem("user"))
                  ?.name?.charAt(0)
                  .toUpperCase() || "U"}
              </Avatar>

              <Button
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderColor: "#2e7d32",
                  color: "#2e7d32",
                  ":hover": {
                    bgcolor: "#e8f5e9",
                    borderColor: "#1b5e20",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
