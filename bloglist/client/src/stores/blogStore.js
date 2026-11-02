import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
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
    addComment: async (content, blog) => {
      const updatedBlog = await blogService.addComment(content, blog);
      set((state) => {
        const blogs = state.blogs
          .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog));
        return { blogs };
      });
    },
  },
}));

export const useBlogs = () => useBlogStore(useShallow((state) => state.blogs));
export const useBlogsActions = () => useBlogStore((state) => state.actions);
