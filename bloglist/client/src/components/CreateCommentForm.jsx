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
    blogActions.addComment(comment, blog);
    notify({ message: "new comment added", type: "success" });
    setComment("");
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
      <label>Comments</label>
      <TextField
        id="outlined-multiline-static"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
};

export default CreateCommentForm;
