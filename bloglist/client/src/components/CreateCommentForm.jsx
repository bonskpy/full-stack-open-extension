import { useBlogsActions } from "../stores/blogStore";
import { useAlertShow } from "../stores/notificationStore";
import { useComment, useSetComment } from "../stores/commentStore";

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
    <form name="comments-form" onSubmit={handleSubmit}>
      <label>
        Comments
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <button>Add</button>
    </form>
  );
};

export default CreateCommentForm;
