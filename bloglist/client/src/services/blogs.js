import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (data) => {
  token = data ? `Bearer ${data}` : null;
};

const setConfig = (token) => {
  return {
    headers: {
      Authorization: token,
    },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createOne = async (blogToBeCreated) => {
  const response = await axios.post(baseUrl, blogToBeCreated, setConfig(token));
  return response.data;
};

const updateOne = async (blogToBeUpdated) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blogToBeUpdated.id)}`;
  const response = await axios.put(blogUrl, blogToBeUpdated, setConfig(token));
  return response.data;
};

const removeOne = async (blogToBeRemoved) => {
  const blogUrl = `${baseUrl}/${encodeURIComponent(blogToBeRemoved.id)}`;
  await axios.delete(blogUrl, setConfig(token));
};

export default { getAll, createOne, updateOne, removeOne, setToken };
