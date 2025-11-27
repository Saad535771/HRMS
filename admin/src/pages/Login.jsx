import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login/bg.png";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import { Email, VpnKey } from "@mui/icons-material";
import  load from "../assets/login/logo.png";
import  logo from "../assets/login/logo.png";
import BaseUrl from "../api/baseurl.js";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
const server_Url=BaseUrl();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(server_Url+"users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user?.id);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("username", response.data.user?.name);
      setOpenDialog(true); // Show loading dialog

      setTimeout(() => {
        setOpenDialog(false);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Logo */}

      {/* Left - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: "center" }}>
           
             <img src={logo} alt="Logo" width={132} height={132} />
           
            <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#626262" }}>
              Welcome to Lacas Employee Management System!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please login to continue
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                InputProps={{
                  startAdornment: <VpnKey color="action" sx={{ mr: 1 }} />,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#ed6e29ff",
                  borderRadius: "20px",
                  "&:hover": { bgcolor: "#eb6816ff", borderRadius: "20px" },
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Container>
      </Grid>

      {/* Right - Background Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      </Grid>

      {/* Loading Dialog */}
      <Dialog open={openDialog}>
        {/* <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>
          Login Successful
        </DialogTitle> */}
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img src={load} alt="Loading..." width={800} />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Login;
