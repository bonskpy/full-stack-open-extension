/**
 * Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed.
 * Authenticated users who are not the blog’s creator are shown only the like button
 * The blog’s creator is also shown the delete button
 */

import { beforeEach, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
// import userEvent from "@testing-library/user-event";

const blog = {
  author: "Joshua Comeau",
  id: "6ab77c9a01396ddfbe89e554",
  likes: 7,
  title: "The End of Front-End Development",
  url: "https://www.joshwcomeau.com/blog/the-end-of-frontend-development/",
  user: { id: "6ab57029a7469e2aaf040e21", username: "jbonski" },
};

describe.skip("<Blog />", () => {
  describe("user is not logged in", () => {
    beforeEach(() => {
      render(
        <Blog blog={blog} user={null} likesHandler={{}} removeHandler={{}} />,
      );
    });

    test.skip("renders the blog", () => {
      const blogTitle = screen.getByTestId("blog-title");
      expect(blogTitle.textContent).toMatch(/The End of Front-End Development/);
      expect(blogTitle).toBeVisible();

      const blogAuthor = screen.getByTestId("blog-author");
      expect(blogAuthor.textContent).toMatch(/Joshua Comeau/);
      expect(blogAuthor).toBeVisible();

      const blogLikes = screen.getByTestId("blog-likes");
      expect(blogLikes.textContent).toMatch(7);
      expect(blogLikes).toBeVisible();

      const blogUrl = screen.getByTestId("blog-url");
      expect(blogUrl).toHaveTextContent(
        "https://www.joshwcomeau.com/blog/the-end-of-frontend-development/",
      );
      expect(blogUrl).toBeVisible();
    });

    //   test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {

    //     const mockHandler = vi.fn();
    //     const user = userEvent.setup();
    //     const buttonLike = screen.getByText("Like!");

    //     expect(buttonLike).toBeVisible();
    //     await user.click(buttonLike);
    //     await user.click(buttonLike);

    //     expect(mockHandler).toHaveBeenCalledTimes(2);
    //     expect(mockHandler).toHaveBeenCalledWith({ ...blog, likes: 8 });
    //   });

    test("blog information and the number of likes are displayed to unauthenticated users", async () => {
      const renderedBlog = screen.getByTestId("blog-listitem");
      expect(renderedBlog).toContainOneByTestId("blog-title");
      expect(renderedBlog).toContainOneByTestId("blog-author");
      expect(renderedBlog).toContainOneByTestId("blog-likes");
      expect(renderedBlog).toContainOneByTestId("blog-url");
      expect(renderedBlog).toContainOneByTestId("blog-user-username");

      expect(screen.getByTestId("blog-title")).toBeVisible().toHaveTextContent(
        blog.title,
      );
      expect(screen.getByTestId("blog-author")).toBeVisible().toHaveTextContent(
        blog.author,
      );
      expect(screen.getByTestId("blog-likes")).toBeVisible().toHaveTextContent(
        blog.likes,
      );
      expect(screen.getByTestId("blog-url")).toBeVisible().toHaveTextContent(
        blog.url,
      );
      expect(screen.getByTestId("blog-user-username")).toBeVisible()
        .toHaveTextContent(blog.user.username);
    });
  });

  describe.skip("user is logged in", () => {
    test("authenticated users who did NOT created the rendered blog are shown only the like button", async () => {
      render(
        <Blog
          blog={blog}
          user={{
            "username": "grbo",
            "name": "Grzegorz Bonski",
            "id": "6ac4ad1930ccb78f16e6d810",
            "token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdyYm8iLCJuYW1lIjoiR3J6ZWdvcnogQm9uc2tpIiwiaWQiOiI2YWM0YWQxOTMwY2NiNzhmMTZlNmQ4MTAiLCJpYXQiOjE3OTE0MDQ0MzIsImV4cCI6MTc5MTQwODAzMn0.Ppk5_vtEw888yHQJORUyGhE0nIsGB6zLsxS7bVjdKJg",
          }}
          likesHandler={{}}
          removeHandler={{}}
        />,
      );

      // check if like button is visible
      const likeButton = screen.getByRole("button", { name: "like!" });
      expect(likeButton).toBeDefined();
      expect(likeButton).toBeVisible();

      // check if remove button is not present at all
      const removeButton = screen.queryByRole("button", { name: "remove" });
      expect(removeButton).toBeNull();
    });

    test("authenticated users who created the rendered blog entry is able to see remove button", async () => {
      render(
        <Blog
          blog={blog}
          user={{
            "username": "jbonski",
            "name": "Jan Bonski",
            "id": "6ab57029a7469e2aaf040e21",
            "token":
              "eyJhbGciOi11UzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdyYm8iLCJuYW1lIjoiR3J6ZWdvcnogQm9uc2tpIiwiaWQiOiI2YWM0YWQxOTMwY2NiNzhmMTZlNmQ4MTAiLCJpYXQiOjE3OTE0MDQ0MzIsImV4cCI6MTc5MTQwODAzMn0.Ppk5_vtEw888yHQJORUyGhE0nIsGB6zLsxS7bVjdKJg",
          }}
          likesHandler={{}}
          removeHandler={{}}
        />,
      );
      // check if like button is visible
      const likeButton = screen.queryByRole("button", { name: "like!" });
      expect(likeButton).toBeDefined();
      expect(likeButton).toBeVisible();

      // check if remove button is visible
      const removeButton = screen.queryByRole("button", { name: "remove" });
      expect(removeButton).toBeDefined();
      expect(removeButton).toBeVisible();
    });
  });
});
