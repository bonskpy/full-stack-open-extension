import { Box, List, ListItem, Typography } from "@mui/material";
import { useUsers } from "../stores/usersStore";

const User = ({ user }) => {
  const users = useUsers();

  const userToRender = users.find((u) => user.id === u.id);

  if (!userToRender) {
    return <div>Loading user...</div>;
  }

  if (userToRender) {
    return (
      <Box>
        <Typography variant="h5">
          {userToRender.name}
        </Typography>
        <Typography variant="body1">
          added blogs
        </Typography>
        <ul>
          {user.blogs.map((blog) => <li>{blog.title}</li>)}
        </ul>
      </Box>
    );
  }
};

export default User;
