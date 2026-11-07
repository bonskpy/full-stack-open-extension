import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import { useNavigate } from "react-router-dom";
import { useAlertShow } from "../stores/notificationStore";
import { useLogin } from "../stores/userStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const userActions = useUserActions();
  const navigate = useNavigate();
  const { notify } = useAlertShow();
  const login = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      setUsername("");
      setPassword("");
      notify({ message: "login successful", type: "success" });
      navigate("/");
    } catch {
      notify({ message: "login failed", type: "error" });
    }
  };

  return (
    <>
      <h2>login to application</h2>
      <form onSubmit={handleLogin}>
        <Stack direction="row" spacing={2}>
          <TextField
            id="username-textfield"
            label="Username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <TextField
            id="password-textfield"
            label="Password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" endIcon={<LoginIcon />} type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
