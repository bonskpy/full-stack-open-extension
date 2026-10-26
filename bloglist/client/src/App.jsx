import { useEffect } from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { Container } from "@mui/material";
import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ErrorBoundary from "./components/ErrorBoundary";
import Error404 from "./components/Error404";
import { useBlogs, useBlogsActions } from "./stores/blogStore";
import { useUser } from "./stores/userStore";
import { useAllUsersFetch } from "./stores/userListStore";
import Users from "./components/Users";

const App = () => {
  const match = useMatch("/blogs/:id");
  const { initialize } = useBlogsActions();
  const blogs = useBlogs();
  const user = useUser();
  const fetchUserList = useAllUsersFetch();
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  return (
    <Container>
      <Header />
      <Notification />
      <ErrorBoundary fallback={<h2>Something went wrong!</h2>}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/users" element={<Users />} />
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
            element={<Error404 />}
          />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </Container>
  );
};

export default App;
