import { Link, useNavigate } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useUser, useUserActions } from "../stores/userStore";
import { useAlertShow } from "../stores/notificationStore";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

const style = {
  backgroundColor: "transparent",
  color: "white",
  marginRight: "5px",
  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
};

const styleLogin = {
  // backgroundColor: "transparent",
  border: "solid 1px white",
  color: "white",
  marginRight: "5px",
  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
};

const Header = () => {
  const user = useUser();
  const userActions = useUserActions();
  const { notify } = useAlertShow();
  const navigate = useNavigate();

  const displayName = user ? user.username : null;

  const handleLogout = () => {
    userActions.logout();
    notify({ message: "logout successful", type: "success" });
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{ marginBottom: "10px", borderRadius: "5px" }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <BookmarksIcon fontSize="large" />
          <Typography
            style={{
              fontWeight: 900,
              letterSpacing: ".3rem",
            }}
          >
            BLOGLIST
          </Typography>
        </div>
        <div>
          <Button style={style} component={Link} to="/">blogs</Button>
          <Button style={style} component={Link} to="/users">users</Button>
          <Button style={style} component={Link} to="/about">about</Button>
          {!user && (
            <Button style={styleLogin} component={Link} to="/login">
              login
            </Button>
          )}

          {user && (
            <Button style={style} component={Link} to="/create">
              create
            </Button>
          )}
          {user && (
            <Button style={styleLogin} onClick={handleLogout}>
              logout ({displayName})
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
