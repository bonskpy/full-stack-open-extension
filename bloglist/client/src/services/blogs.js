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

/**
 * Adds new anonymous comment to a blog.
 * @param {*} blog - blog object with a new comment.
 */
const createComment = async (blog) => {
  const commentUrl = `${baseUrl}/${encodeURIComponent(blog.id)}/comments`;
  const response = await axios.put(commentUrl, blog, setConfig());
  return response.data;
};

export default { getAll, createComment, createOne, updateOne, removeOne };
