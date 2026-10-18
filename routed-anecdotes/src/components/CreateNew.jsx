import { useNavigate } from "react-router";
import { useField } from "../src/index";
import InputField from "./InputField.jsx";

const CreateNew = ({ addAnecdote }) => {
  const navigate = useNavigate();
  const content = useField("content");
  const author = useField("author");
  const info = useField("info");

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
  };

  const handleReset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <InputField {...content} />
        </div>
        <div>
          author
          <InputField {...author} />
        </div>
        <div>
          url for more info
          <InputField {...info} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

export default CreateNew;
