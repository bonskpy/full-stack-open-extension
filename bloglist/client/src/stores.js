import { create } from "zustand";

export const useNotification = create((set) => ({
  alert: {
    message: "",
    type: ""
  },
  set: (alert) => {
    const { message, type } = alert;
    set({ alert:
      { message, type } });
  },
  clear: () => {
    set({ alert:
    { message: "", type: "" } });
  }
})
);
