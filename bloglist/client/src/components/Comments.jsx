import { List, ListItem } from "@mui/material";

const Comments = ({ blog }) => {
  if (blog.comments.length > 0) {
    return (
      <List>
        {blog.comments.map((comment) => <ListItem>{comment}</ListItem>)}
      </List>
    );
  }
};

export default Comments;
