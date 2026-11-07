import { create } from "zustand";
import loginService from "../services/login";
import { getUser, removeUser, saveUser } from "../services/persistentUser";

const userStore = create((set) => ({
  user: getUser(),
  actions: {
    // login: async (credentials) => {
    //   const user = await loginService.login(credentials);
    //   saveUser(user);
    //   set({ user });
    // },
    logout: () => {
      removeUser(removeUser);
      set({ user: null });
    },
  },
}));

export const useUser = () => userStore((state) => state.user);
export const useUserActions = () => userStore((state) => state.actions);
export const getToken = () => userStore.getState().user?.token;

export const useLogin = () => async (credentials) => {
  console.log("useLogin running...");
  const user = await loginService.login(credentials);
  console.log(user);
  saveUser(user);
  userStore.setState({ user });
};
