// TODO
import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import { useUserActions } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { useAlertShow } from "../stores/notificationStore";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userActions = useUserActions();
  const navigate = useNavigate();
  const { notify } = useAlertShow();

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { username, password };
    try {
      await userActions.login(credentials);
      setUsername("");
      setPassword("");
      notify({ message: "login successful", type: "success" });
      navigate("/");
    } catch (err) {
      notify({ message: "login failed", type: "error" });
      throw err;
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
