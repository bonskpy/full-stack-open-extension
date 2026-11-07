export const getUser = () => {
  console.log("getUser: fetching user...");
  const loggedUser = window.localStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  }
  return null;
};
export const saveUser = (user) => {
  // TODO: QuotaExceededError should be handeled
  console.log("saveUser: saving user...");
  window.localStorage.setItem("loggedUser", JSON.stringify(user));
};
export const removeUser = () => {
  console.log("removeUser: removing user...");
  window.localStorage.removeItem("loggedUser");
};
