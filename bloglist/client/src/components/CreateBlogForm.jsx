import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useBlogsActions } from "../stores/blogStore";
import { useAlertShow } from "../stores/notificationStore";

const CreateBlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { create } = useBlogsActions();
  const { notify } = useAlertShow();

  const handleCreateNew = async (e) => {
    e.preventDefault();

    const blogData = {
      title,
      author,
      url,
    };
    await create(blogData);
    notify({ message: "new blog is created", type: "success" });
    setTitle("");
    setAuthor("");
    setUrl("");
    navigate("/");
  };

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={handleCreateNew}>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <TextField
            id="title-textfield"
            label="title"
            value={title}
            size="small"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="author-textfield"
            label="author"
            value={author}
            size="small"
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            id="url-textfield"
            label="url"
            value={url}
            size="small"
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button variant="contained" endIcon={<AddIcon />} type="submit">
            create
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default CreateBlogForm;
