import { create } from "zustand";

const useCommentStore = create((set) => ({
  comment: "",
  set: (comment) => set({ comment }),
}));

export const useComment = () => useCommentStore((state) => state.comment);
export const useSetComment = () => useCommentStore((state) => state.set);
