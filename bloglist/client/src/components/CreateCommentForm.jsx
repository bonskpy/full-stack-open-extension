import { Button, Input, TextField } from "@mui/material";
import { useState } from "react";
import blogsService from "../services/blogs";
import { useBlogsActions } from "../stores/blogStore";
import { useAlertShow } from "../stores/notificationStore";

const CreateCommentForm = ({ blog }) => {
  // TODO: move state & logic to a store.
  const [comment, setComment] = useState("");
  const { notify } = useAlertShow();
  const blogActions = useBlogsActions();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const comments = blog.comments.concat(comment);
    const updated = await blogsService.createComment({ ...blog, comments });
    notify({ message: "new comment added", type: "success" });
    setComment("");
    blogActions.comment(updated);
  };

  return (
    <form name="comments-form" onSubmit={handleSubmit}>
      <TextField
        size="small"
        multiline="false"
        label="Comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <Button variant="outlined" type="input">Add</Button>
    </form>
  );
};

export default CreateCommentForm;
