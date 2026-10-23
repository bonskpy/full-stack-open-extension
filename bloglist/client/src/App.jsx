import { useEffect, useState } from "react";
import { Route, Routes, useMatch, useNavigate } from "react-router-dom";

import { Container } from "@mui/material";

import blogService from "./services/blogs";
import loginService from "./services/login";

import { checkLocalStorage } from "./utils";

import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ErrorBoundary from "./components/ErrorBoundary";

import { useNotification } from "./stores";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(checkLocalStorage);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");

  const alert = useNotification((state) => state.set);
  const clearAlert = useNotification((state) => state.clear);

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(
          blogs.sort((a, b) =>
            a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0
          ),
        )
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
    alert({ message: error.response.data.message, type: "error" });
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const credentials = { username, password };
      const loggedUser = await loginService.login(credentials);
      setUser(loggedUser);

      alert({ message: "login successful", type: "success" });
      navigate("/");
    } catch (err) {
      alert({ message: "login failed", type: "error" });
      throw err;
    } finally {
      setTimeout(() => clearAlert(), 3000);
    }
  };

  const handleCreate = async (blog) => {
    try {
      const createdBlog = await blogService.createOne(blog);
      setBlogs((blogs) => blogs.concat(createdBlog));
      alert({ message: "new blog is created", type: "success" });
    } catch (error) {
      alert({ message: "new blog was not created", type: "error" });
      throw error;
    } finally {
      setTimeout(() => clearAlert(), 3000);
    }
  };

  const handleRemove = async (blog) => {
    try {
      await blogService.removeOne(blog);
      setBlogs((blogs) =>
        blogs
          .filter((b) => b.id !== blog.id)
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))
      );
      alert({ message: "blog removed", type: "info" });
      navigate("/");
    } catch (error) {
      errorHandler(error);
    } finally {
      setTimeout(() => clearAlert(), 3000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    alert({ message: "logout successful", type: "success" });
    setTimeout(() => clearAlert(), 3000);
    navigate("/");
  };

  const handleLikes = async (blog) => {
    try {
      const updatedBlog = await blogService.updateOne(blog);

      setBlogs((blogs) =>
        blogs
          .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))
      );
    } catch (error) {
      errorHandler(error);
      handleLogout();
      alert({ message: "please login", type: "info" });
    } finally {
      setTimeout(() => clearAlert(), 3000);
    }
  };

  return (
    <Container>
      <Header user={user} handleLogout={handleLogout} />
      <Notification />

      <ErrorBoundary fallback={<h2>Something went wrong!</h2>}>
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/"
            element={
              <Blogs
                blogs={blogs}
                likesHandler={handleLikes}
                removeHandler={handleRemove}
              />
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
                likesHandler={handleLikes}
                removeHandler={handleRemove}
              />
            }
          />

          <Route
            path="/create"
            element={<CreateBlogForm onCreate={handleCreate} />}
          />
          <Route
            path="*"
            element={<h2>404 - Page not found</h2>}
          />
        </Routes>
      </ErrorBoundary>

      <Footer />
    </Container>
  );
};

export default App;
