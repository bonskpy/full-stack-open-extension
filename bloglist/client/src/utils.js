export const checkLocalStorage = () => {
  const loggedUser = window.localStorage.getItem("loggedUser");
  if (loggedUser) {
    return JSON.parse(loggedUser);
  }
  return null;
};
