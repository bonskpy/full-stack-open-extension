import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("zustand");

afterEach(() => {
  /*
  cleanup() unmounts component from the container and destroyes the container. Vitest does not provide global afterEach.
  Without this every render() would attach another component to the DOM. Components would stay in the DOM between tests.
  In tests config include {globals: true} this code is redundant and it is here only for safety purposes.
  */
  cleanup();
});
