export const getUser = () => {
  const loggedUser = window.localStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  }
  return null;
};
export const saveUser = (user) => {
  // TODO: QuotaExceededError should be handeled
  window.localStorage.setItem("loggedUser", JSON.stringify(user));
};
export const removeUser = () => {
  window.localStorage.removeItem("loggedUser");
};
