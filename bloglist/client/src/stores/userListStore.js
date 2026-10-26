import { create } from "zustand";
import getAllUsers from "../services/users";

const userListStore = create((set) => ({
  allUsers: [],
  fetch: async () => {
    const allUsers = await getAllUsers();
    set({ allUsers });
  },
}));

export const useAllUsers = () => userListStore((state) => state.allUsers);
export const useAllUsersFetch = () => userListStore((state) => state.fetch);
