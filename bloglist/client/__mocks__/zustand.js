import { afterEach, vi } from "vitest";
import { act } from "@testing-library/react";

// Import module with importActual is useful when only part of the module requires mocking.
const { create: actualCreate } = await vi.importActual("zustand");

// This will hold all functions that reset stores.
export const storeResetFunctions = new Set();

// Function will take a state creator function, create a real store, fetch initial state,
// and finally, add a function that sets initial state to a store to storeResetFunctions,
const createUncurried = (stateCreator) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();
  storeResetFunctions.add(() => {
    store.setState(initialState, true); // second argument replaces whole state instead of merging
  });
  return store;
};

export const create = (stateCreator) => {
  console.log("zustand create mock");

  return typeof stateCreator === "function"
    ? createUncurried(stateCreator)
    : createUncurried; // this is a typescript form, where create is called craete()(fn)
};

afterEach(() => {
  /**
   * afterEach hooks are run in reverse orders.
   * Store reset might run before React component cleanup.
   * This will cause change in state and Vitest will complain about it:
   * An update to Notification inside a test was not wrapped in act(...)
   * This can be verified by running tests with --sequence.hooks=list
   */
  act(() =>
    storeResetFunctions.forEach((func) => {
      func();
    })
  );
});
