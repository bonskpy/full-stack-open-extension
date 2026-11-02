const Comments = ({ blog }) => {
  if (blog.comments) {
    return (
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    );
  }

  return null;
};

export default Comments;
