import { create } from "zustand";
import blogService from "./services/blogs";

let timeoutId;
const useAlertStore = create((set) => ({
  alert: {
    message: "",
    type: "",
  },
  actions: {
    notify: (newAlert) => {
      clearTimeout(timeoutId);
      set({
        alert: newAlert,
      });
      timeoutId = setTimeout(() => {
        set({
          alert: {
            message: "",
            type: "",
          },
        });
      }, 3000);
    },
  },
}));

export const useAlertValue = () => useAlertStore((state) => state.alert);
export const useAlertShow = () => useAlertStore((state) => state.actions);

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const fetchedBlogs = await blogService.getAll();
      const blogs = fetchedBlogs.sort((a, b) =>
        a.likes > b.likes ? -1 : a.likes < b.likes ? 1 : 0
      );
      set({ blogs });
    },
    create: async (blog) => {
      const createdBlog = await blogService.createOne(blog);
      set((state) => ({
        blogs: state.blogs.concat(createdBlog),
      }));
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
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogsActions = () => useBlogStore((state) => state.actions);

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
