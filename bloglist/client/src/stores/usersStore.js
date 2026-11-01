import { create } from "zustand";
import getAllUsers from "../services/users";

const userListStore = create((set) => ({
  allUsers: [],
  actions: {
    fetch: async () => {
      const allUsers = await getAllUsers();
      set({ allUsers });
    },
  },
}));

export const useUsers = () => userListStore((state) => state.allUsers);
export const useUsersActions = () => userListStore((state) => state.fetch);
