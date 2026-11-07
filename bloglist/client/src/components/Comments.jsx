import { Divider, List, ListItem, ListItemText } from "@mui/material";

const Comments = ({ blog }) => {
  if (blog.comments) {
    return (
      <List>
        {blog.comments.map((comment) => (
          <div>
            <ListItem>
              <ListItemText key={comment.id} primary={comment.content} />
            </ListItem>
            <Divider variant="middle" component="li" />
          </div>
        ))}
      </List>
    );
  }

  return null;
};

export default Comments;
