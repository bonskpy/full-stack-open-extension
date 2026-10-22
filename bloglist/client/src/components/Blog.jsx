import { Card, CardActions, CardContent, Typography, Button, Link } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Blog = ({ blog, user, likesHandler, removeHandler }) => {

  if (!blog) {
    console.log("loading...");
    return;
  }

  const handleLikes = async () => {
    const update = {
      ...blog,
      likes: blog.likes + 1,
    };
    await likesHandler(update);
  };

  const handleRemove = async () => {
    const message = `Removing: "${blog.title}"`;
    if (!window.confirm(message)) return;
    await removeHandler(blog);
  };

  return (
    <Card data-testid="blog-listitem">
      <CardContent>

        <Typography color="primary" gutterBottom variant="h5" component="div" data-testid="blog-title">
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
        <Typography variant="caption" component="div" data-testid="blog-user-username">
          created by {blog.user.username}
        </Typography>

        <CardActions>
          {user && <Button endIcon={<ThumbUpOffAltIcon/>} size="small" data-testid="blog-button-likes" type="button" onClick={handleLikes}>like</Button>}
          {user?.username === blog.user.username && <Button color="error" endIcon={<HighlightOffIcon/>} size="small" data-testid="blog-button-remove" type="button" onClick={handleRemove}>remove</Button>}
        </CardActions>

      </CardContent>
    </Card>
  );
};
export default Blog;
