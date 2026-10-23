import { Link } from "react-router-dom";
import { AppBar, Button, Toolbar } from "@mui/material";

const style = {
  backgroundColor: "transparent",
  color: "white",
  marginRight: "5px",
  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
};

const Header = ({ user, handleLogout }) => {
  const displayName = user ? user.username : null;

  return (
    <AppBar
      position="static"
      sx={{ marginBottom: "10px", borderRadius: "5px" }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button style={style} component={Link} to="/">blogs</Button>
          <Button style={style} component={Link} to="/about">about</Button>
        </div>
        <div>
          {!user && (
            <Button style={style} component={Link} to="/login">login</Button>
          )}

          {user && (
            <Button style={style} component={Link} to="/create">
              create
            </Button>
          )}
          {user && (
            <Button style={style} onClick={handleLogout}>
              logout ({displayName})
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
