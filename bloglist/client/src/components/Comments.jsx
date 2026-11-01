import { Box, List, ListItem, Typography } from "@mui/material";

const Comments = ({ blog }) => {
  if (blog.comments.length > 0) {
    return (
      <Box>
        <Typography>
          comments:
          <List>
            {blog.comments.map((comment) => <ListItem>{comment}</ListItem>)}
          </List>
        </Typography>
      </Box>
    );
  }
};

export default Comments;
