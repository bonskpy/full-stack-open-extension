// TODO
import { useState } from "react";
import { TextField, Button, Stack, Paper } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { username, password };
    await onLogin(credentials);
    setUsername("");
    setPassword("");
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
          <Button variant="contained" endIcon={<LoginIcon />} type="submit">Login</Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
