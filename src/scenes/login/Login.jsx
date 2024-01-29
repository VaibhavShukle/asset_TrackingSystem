import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import backgroundImage from "../../components/image/asset-management-2.webp";

function BackgroundImageContainer({ children }) {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

function Copyright(props) {
  return (
    <Typography 
      variant="body2"
      color="text.secondary"
      align="center"
      style={{ color: "white", marginLeft: "50%" }}
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        WindHans Technologies
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;


  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/api/auth/login", values)
      .then((res) => {
        if (res.data.status === "Success") {
          localStorage.setItem("email", values.email);
          localStorage.setItem("password", values.password);
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
          toast("Login Successfully.", {
            type: "success",
            autoClose: 1500,
            theme: "dark",
          });
        } else {
          setError(res.data.Error);
          toast("Username or Password Incorrect.", {
            type: "error",
            autoClose: 1500,
            theme: "dark",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast("An error occurred. Please try again.", {
          type: "error",
          autoClose: 1500,
          theme: "dark",
        });
      });
  };
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <BackgroundImageContainer>
        {/* <Container component="main" maxWidth="xs" style={{ backgroundImage: `url(${backgroundImage})`,  opacity: 0.8,backgroundPosition: 'center',minHeight: '100vh',minWidth: '100vh',display: 'flex',flexDirection: 'column',alignItems: 'center', }}> */}
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            padding: "20px",
            borderRadius: "8px",
            width: "30%",
            marginTop: "12%",
            marginLeft: "50%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          {error && <Typography color="error">{error}</Typography>}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </BackgroundImageContainer>
      {/* </Container> */}
    </ThemeProvider>
  );
}
