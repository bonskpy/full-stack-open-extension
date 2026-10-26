import { create } from "zustand";
import loginService from "../services/login";

const checkLocalStorage = () => {
  const loggedUser = window.localStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  }
  return null;
};

const userStore = create((set) => ({
  user: checkLocalStorage(),
  actions: {
    login: async (credentials) => {
      const user = await loginService.login(credentials);
      set({ user });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
    },
    logout: () => {
      set({ user: null });
      window.localStorage.removeItem("loggedUser");
    },
  },
}));

export const useUser = () => userStore((state) => state.user);
export const useUserActions = () => userStore((state) => state.actions);
export const getToken = () => userStore.getState().user?.token;
