import axios from "axios";
import { getToken } from "../stores/userStore";
const baseUrl = "/api/blogs";

const setConfig = () => {
  const token = getToken();
  return token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : {};
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createOne = async (blog) => {
  const response = await axios.post(baseUrl, blog, setConfig());
  return response.data;
};

const updateOne = async (blog) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blog.id)}`;
  const response = await axios.put(blogUrl, blog, setConfig());
  return response.data;
};

const removeOne = async (blog) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blog.id)}`;
  await axios.delete(blogUrl, setConfig());
};

const addComment = async (comment, blog) => {
  const commentUrl = `${baseUrl}/${encodeURIComponent(blog.id)}/comments`;
  const response = await axios.post(commentUrl, { content: comment });
  return response.data;
};

export default { getAll, addComment, createOne, updateOne, removeOne };
