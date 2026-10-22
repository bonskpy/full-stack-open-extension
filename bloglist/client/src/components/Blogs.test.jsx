import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import Blogs from "./Blogs";
import { MemoryRouter } from "react-router-dom";

const blogs = [{
  author: "Joshua Comeau",
  id: "6ab77c9a01396ddfbe89e554",
  likes: 7,
  title: "The End of Front-End Development",
  url: "https://www.joshwcomeau.com/blog/the-end-of-frontend-development/",
  user: { id: "6ab57029a7469e2aaf040e21", username: "jbonski" },
},
{
  author: "Aditya Tiwari",
  id: "6ab77c9a01396ddfbe89e514",
  likes: 0,
  title: "Vitest with React Testing Library: A Modern Approach to Testing React Apps",
  url: "https://blog.incubyte.co/blog/vitest-react-testing-library-guide/",
  user: { id: "6ac4ad1930ccb78f16e6d810", username: "grbo" },
}];

beforeEach( () => {

  render(
    <MemoryRouter>
      <Blogs blogs={blogs} />
    </MemoryRouter>);
});

describe("<Blogs />", () => {


  test("renders blogs", async () => {

    const header = screen.getByText("saved blogs");
    const firstBlog = screen.getByText("The End of Front-End Development");
    const secondBlog = screen.getByText("Vitest with React Testing Library: A Modern Approach to Testing React Apps");

    expect(header).toBeVisible();
    expect(firstBlog).toBeDefined();
    expect(secondBlog).toBeDefined();
  });

  test("each blog is a clickable link pointing at blog id", async () => {

    const blogLink = screen.getByRole("link", { name: blogs[0].title } );
    expect(blogLink).toHaveAttribute("href", `/blogs/${blogs[0].id}`);
  });
});
