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
import { useBlogs, useBlogsActions } from "./stores/blogStore";
import { useAlertShow } from "./stores/notificationStore";

const App = () => {
  const [user, setUser] = useState(checkLocalStorage);
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");
  const { notify } = useAlertShow();
  const { initialize } = useBlogsActions();
  const blogs = useBlogs();

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
    } else {
      blogService.setToken(null);
      window.localStorage.removeItem("loggedUser");
    }
  }, [user]);

  // const errorHandler = async (error) => {
  //   handleLogout();
  //   notify({ message: "someting went wrong", type: "error" });
  //   console.log(error.response?.data?.message);
  // };

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

  const handleLogout = () => {
    setUser(null);
    notify({ message: "logout successful", type: "success" });
    navigate("/");
  };

  return (
    <Container>
      <Header user={user} handleLogout={handleLogout} />
      <Notification />
      <ErrorBoundary fallback={<h2>Something went wrong!</h2>}>
        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Blogs />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                user={user}
              />
            }
          />
          <Route
            path="/create"
            element={<CreateBlogForm />}
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
