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

import { useAlertShow, useBlogs, useBlogsActions } from "./stores";

const App = () => {
  const [blogsOld, setBlogs] = useState([]);
  const [user, setUser] = useState(checkLocalStorage);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");

  const { notify } = useAlertShow();
  const { initialize, create, remove } = useBlogsActions();
  const blogs = useBlogs();

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  // useEffect(() => {
  //   blogService
  //     .getAll()
  //     .then((blogs) =>
  //       setBlogs(
  //         blogs.sort((a, b) =>
  //           a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0
  //         ),
  //       )
  //     );
  // }, []);

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
    notify({ message: error.response.data.message, type: "error" });
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const credentials = { username, password };
      const loggedUser = await loginService.login(credentials);
      setUser(loggedUser);

      notify({ message: "login successful", type: "success" });
      navigate("/");
    } catch (err) {
      notify({ message: "login failed", type: "error" });
      throw err;
    }
  };

  const handleCreate = async (blog) => {
    await create(blog);
    notify({ message: "new blog is created", type: "success" });
    // try {
    //   const createdBlog = await blogService.createOne(blog);
    //   setBlogs((blogs) => blogs.concat(createdBlog));
    //   notify({ message: "new blog is created", type: "success" });
    // } catch (error) {
    //   notify({ message: "new blog was not created", type: "error" });
    //   throw error;
    // }
  };

  const handleRemove = async (blog) => {
    await remove(blog);
    notify({ message: "blog removed", type: "info" });
    navigate("/");

    // try {
    //   await blogService.removeOne(blog);
    //   setBlogs((blogs) =>
    //     blogs
    //       .filter((b) => b.id !== blog.id)
    //       .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))
    //   );
    //   notify({ message: "blog removed", type: "info" });
    // } catch (error) {
    //   errorHandler(error);
    // }
  };

  const handleLogout = () => {
    setUser(null);
    notify({ message: "logout successful", type: "success" });
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
      notify({ message: "please login", type: "info" });
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
