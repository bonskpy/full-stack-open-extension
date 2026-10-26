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

const createOne = async (blogToBeCreated) => {
  const response = await axios.post(baseUrl, blogToBeCreated, setConfig());
  return response.data;
};

const updateOne = async (blogToBeUpdated) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blogToBeUpdated.id)}`;
  const response = await axios.put(blogUrl, blogToBeUpdated, setConfig());
  return response.data;
};

const removeOne = async (blogToBeRemoved) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blogToBeRemoved.id)}`;
  await axios.delete(blogUrl, setConfig());
};

export default { getAll, createOne, updateOne, removeOne };
