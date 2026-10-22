import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Blogs = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
              <TableCell>likes</TableCell>
              <TableCell>username</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{blog.likes}</TableCell>
                <TableCell>{blog.user.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;
