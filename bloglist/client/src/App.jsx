import { useEffect, useState } from "react";

import { Routes, Route, useNavigate, useMatch } from "react-router-dom";

import blogService from "./services/blogs";
import loginService from "./services/login";

import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { Container } from "@mui/material";

const checkLocalStorage = () => {
  const loggedUser = window.localStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  }
  return null;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(checkLocalStorage);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");

  const blog = match
    ? blogs.find( (blog) => blog.id === match.params.id)
    : null;

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(
          blogs.sort((a, b) =>
            a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0,
          ),
        ),
      );
  }, []);

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
    } else {
      blogService.setToken(null);
      window.localStorage.removeItem("loggedUser");
    }
  }, [user]);

  const errorHandler = async (error) => {
    setNotification({ content: error.response.data.message, type: "error" });
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const credentials = { username, password };
      const loggedUser = await loginService.login(credentials);
      setUser(loggedUser);
      setNotification({ content: "login successful", type: "success" });
      navigate("/");
    } catch (err) {
      setNotification({ content: "login failed" });
      throw err;
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.createOne(blog);
      setBlogs((blogs) => blogs.concat(createdBlog));
      setNotification({ content: "new blog is created", type: "success " });
    } catch (error) {
      setNotification({ content: "New blog was not created", type: "error" });
      throw error;
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemove = async (blog) => {
    try {
      await blogService.removeOne(blog);
      setBlogs((blogs) =>
        blogs
          .filter((b) => b.id !== blog.id)
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0)),
      );
      setNotification({ content: "blog removed", type: "info" });
      navigate("/");
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setNotification({ content: "logout successful", type: "success" });
    setTimeout(() => setNotification(null), 3000);
    navigate("/");
  };

  const handleLikes = async (blog) => {
    try{
      const updatedBlog = await blogService.updateOne(blog);

      setBlogs((blogs) =>
        blogs
          .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0)),
      );
    }
    catch (error){
      errorHandler(error);
      handleLogout();
      setNotification({ content: "please login", type: "info" });
    }
    finally {
      setTimeout(() => setNotification(null), 3000);
    }

  };

  return (
    <Container>
      <Header user={user} handleLogout={handleLogout}/>
      <Notification message={notification} />

      <Routes>
        <Route path='/login' element={
          <LoginForm onLogin={handleLogin} />
        } />

        <Route path='/' element={
          <Blogs
            blogs={blogs}
            likesHandler={handleLikes}
            removeHandler={handleRemove} />
        } />

        <Route path='/blogs/:id' element={
          <Blog
            blog={blog}
            user={user}
            likesHandler={handleLikes}
            removeHandler={handleRemove} />
        } />

        <Route path='/create' element={
          <CreateBlogForm onCreate={handleCreate} />
        } />

      </Routes>
      <Footer />
    </Container>
  );
};





export default App;
