import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const style = { backgroundColor: "transparent", color:"white", marginRight: "5px", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

const Header = ({ user, handleLogout }) => {
  return (
    <AppBar position="static" sx={{ marginBottom: "10px", borderRadius: "5px" }}>
      <Toolbar>
        <Button style={style} component={Link} to='/'>blogs</Button>

        {!user && <Button style={style} component={Link} to='/login'>login</Button>}

        {user && <Button style={style} component={Link} to='/create'>create</Button>}
        {user && <Button style={style} onClick={handleLogout}>logout</Button>}

      </Toolbar>
    </AppBar>
  );};

export default Header;
