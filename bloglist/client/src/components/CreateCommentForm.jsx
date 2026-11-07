import { useBlogsActions } from "../stores/blogStore";
import { useAlertShow } from "../stores/notificationStore";
import { useComment, useSetComment } from "../stores/commentStore";
import { Button, TextField } from "@mui/material";

const CreateCommentForm = ({ blog }) => {
  const comment = useComment();
  const setComment = useSetComment();

  const { notify } = useAlertShow();
  const blogActions = useBlogsActions();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await blogActions.addComment(comment, blog);
      notify({ message: "new comment added", type: "success" });
      setComment("");
    } catch {
      notify({ message: "faield to add new comment", type: "error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "fit-content",
      }}
    >
      <TextField
        label="comment"
        type="text"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" variant="contained">
        add comment
      </Button>
    </form>
  );
};

export default CreateCommentForm;
