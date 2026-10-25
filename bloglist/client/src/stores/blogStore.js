import { create } from "zustand";
import blogService from "../services/blogs";

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    create: async (blog) => {
      const createdBlog = await blogService.createOne(blog);
      set((state) => ({
        blogs: state.blogs.concat(createdBlog),
      }));
    },
    initialize: async () => {
      const fetchedBlogs = await blogService.getAll();
      const blogs = fetchedBlogs.sort((a, b) =>
        a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0
      );
      set({ blogs });
    },
    remove: async (blog) => {
      await blogService.removeOne(blog);
      set((state) => {
        const blogs = state.blogs
          .filter((b) => b.id !== blog.id)
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0));
        return { blogs };
      });
    },
    like: async (blog) => {
      const updatedBlog = await blogService.updateOne(blog);
      set((state) => {
        const blogs = state.blogs
          .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
          .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0));
        return { blogs };
      });
    },
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogsActions = () => useBlogStore((state) => state.actions);

// const handleLikes = async (blog) => {
//   try {
//     const updatedBlog = await blogService.updateOne(blog);

//     setBlogs((blogs) =>
//       blogs
//         .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
//         .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))
//     );
//   } catch (error) {
//     errorHandler(error);
//     handleLogout();
//     notify({ message: "please login", type: "info" });
//   }
// };

// const handleCreate = async (blog) => {
//   try {
//     const createdBlog = await blogService.createOne(blog);
//     setBlogs((blogs) => blogs.concat(createdBlog));
//     notify({ message: "new blog is created", type: "success" });
//   } catch (error) {
//     notify({ message: "new blog was not created", type: "error" });
//     throw error;
//   }
// };

// const handleRemove = async (blog) => {
//   try {
//     await blogService.removeOne(blog);
//     setBlogs((blogs) =>
//       blogs
//         .filter((b) => b.id !== blog.id)
//         .sort((a, b) => (a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0))
//     );
//     notify({ message: "blog removed", type: "info" });
//     navigate("/");
//   } catch (error) {
//     errorHandler(error);
//   }
// };
