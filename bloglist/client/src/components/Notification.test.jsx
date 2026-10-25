import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import { useAlertShow } from "../stores/notificationStore";
import Notification from "./Notification";

describe.only("<Notification /> component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("alert shows up when state is updated", () => {
    const { result } = renderHook(() => useAlertShow());
    render(<Notification />);

    act(() => result.current.notify({ message: "super error", type: "error" }));
    expect(screen.getByRole("alert")).toHaveTextContent("super error");
  });

  test("alert does not show when state is empty", () => {
    const { container } = render(<Notification />);
    expect(container).toBeEmptyDOMElement();
  });

  test("alert shows up and disapears after 3 seconds", () => {
    const { result } = renderHook(() => useAlertShow());
    render(<Notification />);

    act(() => result.current.notify({ message: "Action test", type: "error" }));
    expect(screen.queryByRole("alert")).toHaveTextContent("Action test");

    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
