import { create } from "zustand";
import { getUser, removeUser, saveUser } from "../services/persistentUser";
import loginService from "../services/login";

const userStore = create(() => ({
  user: getUser(),
}));

export const useUser = () => userStore((state) => state.user);
export const getToken = () => userStore.getState().user?.token;

export const useLogin = () => async (credentials) => {
  console.log("useLogin running...");
  const user = await loginService.login(credentials);
  console.log(user);
  saveUser(user);
  userStore.setState({ user });
};

export const useLogout = () => async () => {
  console.log("useLogout running...");
  removeUser();
  userStore.setState({ user: null });
};
