import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useBlogsActions } from "../stores/blogStore";
import { useAlertShow } from "../stores/notificationStore";
import { useNavigate } from "react-router-dom";

const Blog = ({ blog, user }) => {
  const { like, remove } = useBlogsActions();
  const { notify } = useAlertShow();
  const navigate = useNavigate();

  if (!blog) {
    return;
  }

  const handleLikes = async () => {
    const update = {
      ...blog,
      likes: blog.likes + 1,
    };
    await like(update);
    notify({ message: "blog updated", type: "success" });
  };

  const handleRemove = async () => {
    const message = `Removing: "${blog.title}"`;
    if (!window.confirm(message)) return;

    await remove(blog);
    notify({ message: "blog removed", type: "info" });
    navigate("/");
  };

  return (
    <Card data-testid="blog-listitem">
      <CardContent>
        <Typography
          color="primary"
          gutterBottom
          variant="h5"
          component="div"
          data-testid="blog-title"
        >
          {blog.title}
        </Typography>
        <Typography gutterBottom component="div" data-testid="blog-title">
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography variant="caption" component="div" data-testid="blog-author">
          author: {blog.author}
        </Typography>
        <Typography variant="caption" component="div" data-testid="blog-likes">
          likes: <span data-testid="blog-likes-count">{blog.likes}</span>
        </Typography>
        <Typography
          variant="caption"
          component="div"
          data-testid="blog-user-username"
        >
          created by {blog.user.username}
        </Typography>

        <CardActions>
          {user && (
            <Button
              endIcon={<ThumbUpOffAltIcon />}
              size="small"
              data-testid="blog-button-likes"
              type="button"
              onClick={handleLikes}
            >
              like
            </Button>
          )}
          {user?.username === blog.user.username && (
            <Button
              color="error"
              endIcon={<HighlightOffIcon />}
              size="small"
              data-testid="blog-button-remove"
              type="button"
              onClick={handleRemove}
            >
              remove
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};
export default Blog;
