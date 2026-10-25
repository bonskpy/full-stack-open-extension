import { create } from "zustand";

let timeoutId;
const useAlertStore = create((set) => ({
  alert: {
    message: "",
    type: "",
  },
  actions: {
    notify: (newAlert) => {
      clearTimeout(timeoutId);
      set({
        alert: newAlert,
      });
      timeoutId = setTimeout(() => {
        set({
          alert: {
            message: "",
            type: "",
          },
        });
      }, 3000);
    },
  },
}));

export const useAlertValue = () => useAlertStore((state) => state.alert);
export const useAlertShow = () => useAlertStore((state) => state.actions);
